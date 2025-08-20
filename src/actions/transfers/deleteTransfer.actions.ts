"use server";

import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";
import { TransferType } from "@/@types/transfers";

export async function deleteTransfer({ id }: TransferType) {
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
        where: { userId, id: transfer.sourceBankId },
        data: {
          amount: transfer.sourceBank.amount + transfer.amount,
        },
      }),
      prisma.accountBanks.update({
        where: { userId, id: transfer.destinationBankId },
        data: {
          amount: transfer.destinationBank.amount - transfer.amount,
        },
      }),
      prisma.transfers.delete({
        where: { userId, id },
      }),
    ]);

    return {
      success: true,
      message: "Transfer deleted successfully",
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: (error as Error).message || "Failed to delete transfer",
    };
  }
}
