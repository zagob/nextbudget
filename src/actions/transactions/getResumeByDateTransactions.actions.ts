"use server";

import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";

interface GetResumeByDateTransactionsProps {
  date: Date;
}

export async function getResumeByDateTransactions({
  date,
}: GetResumeByDateTransactionsProps) {
  try {
    const userId = await getUserAuth();

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();

    const firstDayUTC = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    const lastDayUTC = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

    const transactions = await prisma.transactions.findMany({
      where: {
        userId,
        date: {
          gte: firstDayUTC,
          lte: lastDayUTC,
        },
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
      message: "Resume by date transactions geted successfully",
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
      message:
        (error as Error).message || "Failed to get resume by date transactions",
    };
  }
}
