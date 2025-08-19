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

    const firstPreviousDayUTC = new Date(
      Date.UTC(year, month - 1, 1, 0, 0, 0, 0)
    );
    const lastPreviousDayUTC = new Date(
      Date.UTC(year, month, 0, 23, 59, 59, 999)
    );

    const firstDayUTC = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    const lastDayUTC = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

    const sumByType = (
      tx: { amount: number; type: string }[],
      type: "INCOME" | "EXPENSE"
    ) =>
      tx.filter((t) => t.type === type).reduce((acc, t) => acc + t.amount, 0);

    const sumBalance = (tx: { amount: number; type: string }[]) =>
      tx.reduce(
        (acc, t) => (t.type === "INCOME" ? acc + t.amount : acc - t.amount),
        0
      );

    const transactionsPrevMonth = await prisma.transactions.findMany({
      where: {
        userId,
        date: {
          gte: firstPreviousDayUTC,
          lte: lastPreviousDayUTC,
        },
      },
      select: {
        amount: true,
        type: true,
      },
    });

    const transactionsCurrentMonth = await prisma.transactions.findMany({
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

    const calcChange = (current: number, previous: number) => {
      if (previous === 0) return { change: null, changeType: null };
      const diff = ((current - previous) / previous) * 100;
      return {
        change: `${diff.toFixed(2)}%`,
        changeType: diff >= 0 ? ("up" as const) : ("down" as const),
      };
    };

    const { balance, income, expense } = {
      balance: {
        current: sumBalance(transactionsCurrentMonth),
        previous: sumBalance(transactionsPrevMonth),
      },
      income: {
        current: sumByType(transactionsCurrentMonth, "INCOME"),
        previous: sumByType(transactionsPrevMonth, "INCOME"),
      },
      expense: {
        current: sumByType(transactionsCurrentMonth, "EXPENSE"),
        previous: sumByType(transactionsPrevMonth, "EXPENSE"),
      },
    };

    return {
      success: true,
      message: "Resume by date transactions geted successfully",
      data: {
        balance: {
          ...balance,
          ...calcChange(balance.current, balance.previous),
        },
        income: {
          ...income,
          ...calcChange(income.current, income.previous),
        },
        expense: {
          ...expense,
          ...calcChange(expense.current, expense.previous),
        },
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
