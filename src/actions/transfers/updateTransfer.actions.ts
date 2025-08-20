"use server";

import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";
import { TransferType } from "@/@types/transfers";

export async function updateTransfer({ id, ...data }: TransferType) {
  try {
    const userId = await getUserAuth();

    const transfer = await prisma.transfers.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        sourceBank: true,
        destinationBank: true,
      },
    });

    if (!transfer) {
      throw new Error("Transfer not found");
    }

    await prisma.$transaction([
      prisma.accountBanks.update({
        where: { id: transfer.sourceBankId },
        data: {
          amount: transfer.sourceBank.amount + transfer.amount,
        },
      }),
      prisma.accountBanks.update({
        where: { id: transfer.destinationBankId },
        data: {
          amount: transfer.destinationBank.amount - transfer.amount,
        },
      }),
    ]);

    const fromAccountBank = await prisma.accountBanks.findUnique({
      where: { id: data.sourceBankId },
      select: { amount: true },
    });

    const toAccountBank = await prisma.accountBanks.findUnique({
      where: { id: data.destinationBankId },
      select: { amount: true },
    });

    if (!fromAccountBank || !toAccountBank) {
      throw new Error("Account bank not found");
    }

    await prisma.$transaction([
      prisma.accountBanks.update({
        where: { id: data.sourceBankId },
        data: {
          amount: fromAccountBank.amount - data.amount,
        },
      }),
      prisma.accountBanks.update({
        where: { id: data.destinationBankId },
        data: {
          amount: toAccountBank.amount + data.amount,
        },
      }),
      prisma.transfers.update({
        where: { id },
        data: {
          userId,
          ...data,
        },
      }),
    ]);

    return {
      success: true,
      message: "Transfer updated successfully",
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: (error as Error).message || "Failed to update transfer",
    };
  }
}
