"use server";

import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";

export async function getQtdTransactionsByType() {
  try {
    const userId = await getUserAuth();

    const { totalCountTransactionsIncome, totalCountTransactionsExpense } =
      await prisma.$transaction(async (tx) => {
        const totalCountTransactionsIncome = await tx.transactions.count({
          where: {
            userId,
            type: "INCOME",
          },
        });
        const totalCountTransactionsExpense = await tx.transactions.count({
          where: {
            userId,
            type: "EXPENSE",
          },
        });

        return { totalCountTransactionsIncome, totalCountTransactionsExpense };
      });

    return {
      success: true,
      message: "Get quantity transactions by type successfully",
      data: {
        totalCountTransactionsIncome,
        totalCountTransactionsExpense,
      },
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: (error as Error).message || "Failed to get transactions",
    };
  }
}
