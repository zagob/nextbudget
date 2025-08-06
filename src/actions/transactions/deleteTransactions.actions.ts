import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";

interface DeleteTransactionsProps {
  transactionId: string;
}

export async function deleteTransactions({
  transactionId,
}: DeleteTransactionsProps) {
  try {
    const userId = await getUserAuth();

    await prisma.transactions.delete({
      where: {
        id: transactionId,
        userId,
      },
    });
    return {
      success: true,
      message: "Transactions deleted successfully",
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: (error as Error).message || "Failed to deleted transactions",
    };
  }
}
