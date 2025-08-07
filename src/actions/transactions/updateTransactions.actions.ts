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

    const transaction = await prisma.transactions.findUnique({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    const accountBank = await prisma.accountBanks.findUnique({
      where: {
        id: transaction.accountBankId,
        userId,
      },
    });

    if (!accountBank) {
      throw new Error("Account bank not found");
    }

    const newAccount = await prisma.accountBanks.findUnique({
      where: {
        id: data.accountBankId,
        userId,
      },
    });

    if (!newAccount) {
      throw new Error("New account bank not found");
    }

    const revertAmount =
      transaction.type === "EXPENSE"
        ? accountBank.amount + transaction.amount
        : accountBank.amount - transaction.amount;

    const applyAmount =
      transaction.type === "EXPENSE"
        ? accountBank.amount - transaction.amount
        : accountBank.amount + transaction.amount;

    // await prisma.$transaction(
    //   [
    //     transaction.accountBankId !== data.accountBankId
    //       ? prisma.accountBanks.update({
    //           where: {
    //             id: transaction.accountBankId,
    //             userId,
    //           },
    //           data: {
    //             amount: revertAmount,
    //           },
    //         })
    //       : prisma.accountBanks.update({
    //           where: {
    //             id: transaction.accountBankId,
    //             userId,
    //           },
    //           data: {
    //             amount: applyAmount,
    //           },
    //         }),
    //     transaction.accountBankId !== data.accountBankId
    //       ? prisma.accountBanks.update({
    //           where: {
    //             id: data.accountBankId,
    //             userId,
    //           },
    //           data: {
    //             amount: applyAmount,
    //           },
    //         })
    //       : undefined,
    //     prisma.transactions.update({
    //       where: {
    //         id: transactionId,
    //         userId,
    //       },
    //       data,
    //     }),
    //   ].filter(Boolean)
    // );

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
