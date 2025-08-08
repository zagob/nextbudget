"use server";

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
    const { accountBankId, amount, categoryId, date, description, type } = data;

    const oldTransaction = await prisma.transactions.findUnique({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (!oldTransaction) {
      throw new Error("Transaction not found");
    }

    const oldAccountBank = await prisma.accountBanks.findUnique({
      where: {
        id: oldTransaction.accountBankId,
        userId,
      },
    });

    if (!oldAccountBank) {
      throw new Error("Account bank not found");
    }

    const newAccountBank = await prisma.accountBanks.findUnique({
      where: {
        id: accountBankId,
        userId,
      },
    });

    if (!newAccountBank) {
      throw new Error("New account bank not found");
    }

    const revertAmount =
      oldTransaction.type === "EXPENSE"
        ? oldAccountBank.amount + oldTransaction.amount
        : oldAccountBank.amount - oldTransaction.amount;

    const applyAmount =
      oldTransaction.type === "EXPENSE"
        ? newAccountBank.amount - amount
        : newAccountBank.amount + amount;

    await prisma.$transaction(async (tx) => {
      if (oldAccountBank.id !== accountBankId) {
        await tx.accountBanks.update({
          where: {
            id: oldTransaction.accountBankId,
            userId,
          },
          data: {
            amount: revertAmount,
          },
        });

        await tx.accountBanks.update({
          where: {
            id: accountBankId,
            userId,
          },
          data: {
            amount: applyAmount,
          },
        });
      } else {
        let ajustAmount = oldAccountBank.amount;

        // remove efeito antigo
        ajustAmount =
          oldTransaction.type === "EXPENSE"
            ? ajustAmount + oldTransaction.amount
            : ajustAmount - oldTransaction.amount;

        // aplica efeito novo
        ajustAmount =
          type === "EXPENSE" ? ajustAmount - amount : ajustAmount + amount;

        await tx.accountBanks.update({
          where: {
            id: accountBankId,
            userId,
          },
          data: {
            amount: ajustAmount,
          },
        });
      }

      await tx.transactions.update({
        where: {
          id: transactionId,
          userId,
        },
        data: {
          accountBankId,
          amount,
          categoryId,
          date,
          description,
          type,
        },
      });
    });

    return {
      success: true,
      message: "Transaction updated successfully",
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: (error as Error).message || "Failed to update transaction",
    };
  }
}
