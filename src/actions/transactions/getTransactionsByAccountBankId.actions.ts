"use server";

import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";

interface GetTransactionsByAccountBankIdProps {
  accountBankId: string;
}

export const getTransactionsByAccountBankId = async ({
  accountBankId,
}: GetTransactionsByAccountBankIdProps) => {
  try {
    const userId = await getUserAuth();

    const count = await prisma.transactions.count({
      where: {
        userId,
        accountBankId,
      },
    });

    return {
      data: {
        count,
        exists: count > 0,
      },
      success: true,
      message: "Transactions by accountBankId fetched successfully",
    };
  } catch (error) {
    return {
      error,
      success: false,
      message:
        (error as Error).message ||
        "Failed to get Transactions by accountBankId",
    };
  }
};
