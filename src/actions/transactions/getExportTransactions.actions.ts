"use server";

import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";

interface GetExportTransactionsProps {
  date: Date;
}

export async function getExportTransactions({ date }: GetExportTransactionsProps) {
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
        accountBankId: true,
        categoryId: true,
        bank: {
          select: {
            bank: true,
          },
        },
      },
    });

    const transactionsFormatted = transactions.map((transaction) => {
      return {
        id: transaction.id,
        accountBankId: transaction.accountBankId,
        categoryId: transaction.categoryId,
        amount: transaction.amount,
        date: transaction.date,
        description: transaction.description,
        type: transaction.type,
        category: transaction.category,
        bank: transaction.bank.bank,
      };
    })

    return {
      success: true,
      message: "Transactions geted successfully",
      data: transactionsFormatted,
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: (error as Error).message || "Failed to get transactions",
    };
  }
}
