"use server";

import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";
import { format } from "date-fns";
import { TransactionType } from "@/@types/transactions";

interface GetTransactionsGroupedDateProps {
  date: Date;
  ascCategory?: boolean;
}

type GroupedTransactionsType = {
  transactions: TransactionType[];
  dayIncome: number;
  dayExpense: number;
  count: number;
};

export async function getTransactionsGroupedDate({
  date,
}: GetTransactionsGroupedDateProps) {
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

    const transactionsCount = await prisma.transactions.count({
      where: {
        userId,
        date: {
          gte: firstDayUTC,
          lte: lastDayUTC,
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
    });

    const transactionsGrouped = transactionsFormatted.reduce(
      (groups, transaction) => {
        const dateKey = format(new Date(transaction.date), "yyyy-MM-dd");

        if (!groups[dateKey]) {
          groups[dateKey] = {
            transactions: [],
            dayIncome: 0,
            dayExpense: 0,
            count: 0,
          };
        }

        groups[dateKey].transactions.push(transaction);
        groups[dateKey].count++;

        if (transaction.type === "INCOME") {
          groups[dateKey].dayIncome += transaction.amount;
        } else {
          groups[dateKey].dayExpense += transaction.amount;
        }

        return groups;
      },
      {} as Record<string, GroupedTransactionsType>
    );

    console.log({
      transactionsGrouped,
    });

    return {
      success: true,
      message: "Transactions grouped geted successfully",
      count: transactionsCount,
      data: transactionsGrouped,
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: (error as Error).message || "Failed to get transactions",
    };
  }
}
