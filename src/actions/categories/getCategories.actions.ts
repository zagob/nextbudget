"use server";

import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";
import { Type } from "@prisma/client";

interface GetCategoriesProps {
  type?: Type;
}

export async function getCategories({ type }: GetCategoriesProps) {
  try {
    const userId = await getUserAuth();

    const categories = await prisma.categories.findMany({
      where: {
        userId,
        type,
      },
      orderBy: {
        Transactions: {
          _count: "asc",
        },
      },
      select: {
        id: true,
        type: true,
        name: true,
        color: true,
        _count: true,
        Transactions: {
          select: {
            amount: true,
          },
        },
      },
    });

    const formatCategories = categories.map((category) => {
      return {
        ...category,
        totalAmountCategory: category.Transactions.reduce(
          (acc, tx) => acc + tx.amount,
          0
        ),
      };
    });

    return {
      success: true,
      message: "Categories geted successfully",
      data: formatCategories,
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: (error as Error).message || "Failed to get categories",
    };
  }
}
