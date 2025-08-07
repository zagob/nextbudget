"use server";

import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";
import { CreateTransactionsType } from "@/@types/transactions";

export async function createTransactions({
  accountBankId,
  amount,
  categoryId,
  date,
  description,
  type,
}: CreateTransactionsType) {
  try {
    const userId = await getUserAuth();

    if (amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    const accountBank = await prisma.accountBanks.findUnique({
      where: {
        userId,
        id: accountBankId,
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
        where: { userId, id: accountBankId },
        data: {
          amount:
            type === "EXPENSE"
              ? accountBank.amount - amount
              : accountBank.amount + amount,
        },
      }),
      prisma.transactions.create({
        data: {
          accountBankId,
          amount,
          categoryId,
          date,
          description,
          type,
          userId,
        },
      }),
    ]);

    return {
      success: true,
      message: "Transaction created successfully",
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: (error as Error).message || "Failed to create transaction",
    };
  }
}
