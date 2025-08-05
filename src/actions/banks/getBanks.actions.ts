"use server";

import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";

export const getBanks = async () => {
  try {
    const userId = await getUserAuth();

    const [banks, aggregate] = await Promise.all([
      prisma.accountBanks.findMany({
        where: { userId },
      }),
      prisma.accountBanks.aggregate({
        where: { userId },
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      data: {
        banks,
        totalBanks: banks.length,
        totalAmount: aggregate._sum.amount ?? 0,
      },
      success: true,
      message: "Banks fetched successfully",
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: (error as Error).message || "Failed to get banks",
    };
  }
};
