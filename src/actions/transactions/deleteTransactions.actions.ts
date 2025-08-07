"use server";

import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";

interface DeleteTransactionsProps {
  transactionId: string;
}

export async function deleteTransactions({
  transactionId,
}: DeleteTransactionsProps) {
  try {
    const userId = await getUserAuth();

    const transaction = await prisma.transactions.findUnique({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    const accountBank = await prisma.accountBanks.findUnique({
      where: {
        userId,
        id: transaction.accountBankId,
      },
      select: {
        amount: true,
      },
    });

    if (!accountBank) {
      throw new Error("Account bank not found");
    }

    await prisma.$transaction([
      prisma.accountBanks.update({
        where: {
          id: transaction.accountBankId,
          userId,
        },
        data: {
          amount:
            transaction.type === "EXPENSE"
              ? accountBank.amount + transaction.amount
              : accountBank.amount - transaction.amount,
        },
      }),
      prisma.transactions.delete({
        where: {
          id: transactionId,
          userId,
        },
      }),
    ]);

    return {
      success: true,
      message: "Transaction deleted successfully",
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: (error as Error).message || "Failed to delete transaction",
    };
  }
}
