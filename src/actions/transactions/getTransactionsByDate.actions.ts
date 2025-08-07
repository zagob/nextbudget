"use server";

import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";
import { endOfMonth, parseISO, startOfMonth } from "date-fns";

interface GetTransactionsProps {
  date: Date;
}

export async function getTransactionsByDate({ date }: GetTransactionsProps) {
  try {
    const userId = await getUserAuth();

    // const parsedDate = parseISO(`${date}-01`);

    const firstDayMonth = startOfMonth(date);
    const lastDayMonth = endOfMonth(date);

    const transactions = await prisma.transactions.findMany({
      where: {
        userId,
        AND: {
          date: {
            gte: firstDayMonth,
            lte: lastDayMonth,
          },
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
          }
        },
        bank: {
          select: {
            bank: true
          }
        }
      }
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
