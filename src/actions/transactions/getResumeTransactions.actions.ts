"use server";

import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";

export async function getResumeTransactions() {
  try {
    const userId = await getUserAuth();

    const transactions = await prisma.transactions.findMany({
      where: {
        userId,
      },
      select: {
        amount: true,
        type: true,
      },
    });

    const totalAmountIncome = transactions
      .filter((transaction) => transaction.type === "INCOME")
      .reduce((acc, transaction) => acc + transaction.amount, 0);

    const totalAmountExpenses = transactions
      .filter((transaction) => transaction.type === "EXPENSE")
      .reduce((acc, transaction) => acc + transaction.amount, 0);

    const totalAmount = transactions.reduce((acc, transaction) => {
      if (transaction.type === "INCOME") {
        return acc + transaction.amount;
      } else {
        return acc - transaction.amount;
      }
    }, 0);

    return {
      success: true,
      message: "Resume transactions geted successfully",
      data: {
        totalAmount,
        totalAmountIncome,
        totalAmountExpenses,
      },
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: (error as Error).message || "Failed to get resume transactions",
    };
  }
}
