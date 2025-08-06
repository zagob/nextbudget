import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";
import { endOfMonth, parseISO, startOfMonth } from "date-fns";

interface DeleteTransactionsProps {
  transactionId: string;
  date: string;
}

export async function deleteTransactions({
  transactionId,
  date,
}: DeleteTransactionsProps) {
  try {
    const userId = await getUserAuth();

    const parsedDate = parseISO(`${date}-01`);
    const firstDayMonth = startOfMonth(parsedDate);
    const lastDayMonth = endOfMonth(parsedDate);

    const transactions = await prisma.transactions.findMany({
      where: {
        id: transactionId,
        userId,
        AND: {
          date: {
            gte: firstDayMonth,
            lte: lastDayMonth,
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
