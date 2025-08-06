import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";
import { CreateTransactionsType } from "@/@types/transactions";

export async function createTransactions({
    accountBankId,
    amount,
    categoryId,
    date,
    description,
    type,
}: CreateTransactionsType) {
  try {
    const userId = await getUserAuth();

    await prisma.transactions.create({
      data: {
        accountBankId,
        amount,
        categoryId,
        date,
        description,
        type,
        userId,
      }
    });
    return {
      success: true,
      message: "transactions created successfully",
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: (error as Error).message || "Failed to create transactions",
    };
  }
}
