import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";
import { CreateTransactionsType } from "@/@types/transactions";

interface UpdateTransactionsProps {
  transactionId: string;
  data: CreateTransactionsType;
}

export async function updateTransactions({
  transactionId,
  data,
}: UpdateTransactionsProps) {
  try {
    const userId = await getUserAuth();

    await prisma.transactions.update({
      where: {
        id: transactionId,
        userId,
      },
      data,
    });
    return {
      success: true,
      message: "Transactions updated successfully",
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: (error as Error).message || "Failed to updated transactions",
    };
  }
}
