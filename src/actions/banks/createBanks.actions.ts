"use server";

import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";
import { CreateAccountBankType } from "@/@types/account-banks";

interface CreateBanksProps {
  data: CreateAccountBankType;
}

export async function createBanks({ data }: CreateBanksProps) {
  try {
    const userId = await getUserAuth();

    await prisma.accountBanks.create({
      data: {
        userId,
        ...data,
      },
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
