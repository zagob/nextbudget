"use server";

import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";
import { CreateTransferType } from "@/@types/transfers";

export async function createTransfer({
  date,
  amount,
  sourceBankId,
  destinationBankId,
  description,
}: CreateTransferType) {
  try {
    const userId = await getUserAuth();

    if (amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    const fromAccountBank = await prisma.accountBanks.findUnique({
      where: {
        userId,
        id: sourceBankId,
      },
      select: {
        amount: true,
      },
    });

    const toAccountBank = await prisma.accountBanks.findUnique({
      where: {
        userId,
        id: destinationBankId,
      },
      select: {
        amount: true,
      },
    });

    if (!fromAccountBank || !toAccountBank) {
      throw new Error("Account bank not found");
    }

    await prisma.$transaction([
      prisma.accountBanks.update({
        where: { userId, id: sourceBankId },
        data: {
          amount: fromAccountBank.amount - amount,
        },
      }),
      prisma.accountBanks.update({
        where: { userId, id: destinationBankId },
        data: {
          amount: toAccountBank.amount + amount,
        },
      }),
      prisma.transfers.create({
        data: {
          userId,
          sourceBankId: sourceBankId,
          destinationBankId: destinationBankId,
          date,
          amount,
          description,
        },
      }),
    ]);

    return {
      success: true,
      message: "Transfer created successfully",
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: (error as Error).message || "Failed to create transfer",
    };
  }
}
