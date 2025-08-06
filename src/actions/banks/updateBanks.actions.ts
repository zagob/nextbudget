"use server";

import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";
import { CreateAccountBankType } from "@/@types/account-banks";

interface UpdateBanksProps {
  bankId: string;
  data: CreateAccountBankType;
}

export async function updateBanks({ bankId, data }: UpdateBanksProps) {
  try {
    const userId = await getUserAuth();

    await prisma.accountBanks.update({
      where: {
        id: bankId,
        userId,
      },
      data,
    });

    return {
      success: true,
      message: "Banks created successfully",
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: (error as Error).message || "Failed to create banks",
    };
  }
}
