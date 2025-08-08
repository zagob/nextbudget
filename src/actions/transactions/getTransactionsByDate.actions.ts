"use server";

import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";

interface GetTransactionsProps {
  date: Date;
}

export async function getTransactionsByDate({ date }: GetTransactionsProps) {
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
        id: true,
        amount: true,
        date: true,
        description: true,
        type: true,
        category: {
          select: {
            name: true,
            color: true,
          },
        },
        bank: {
          select: {
            bank: true,
          },
        },
      },
    });

    return {
      success: true,
      message: "Transactions geted successfully",
      data: transactions,
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: (error as Error).message || "Failed to get transactions",
    };
  }
}
