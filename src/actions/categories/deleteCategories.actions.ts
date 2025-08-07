"use server"

import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";

interface DeleteCategoriesProps {
  categoryId: string;
}

export async function deleteCategories({ categoryId }: DeleteCategoriesProps) {
  try {
    const userId = await getUserAuth();

    const transactionsWithCategoryId = await prisma.transactions.count({
      where: {
        userId,
        categoryId
      }
    })

    if(transactionsWithCategoryId > 0) {
      return {
        error: new Error("Category has transactions"),
        success: false,
        message: "Category has transactions",
      };
    }

    await prisma.categories.delete({
      where: {
        id: categoryId,
        userId,
      },
    });
    return {
      success: true,
      message: "Categories deleted successfully",
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: (error as Error).message || "Failed to deleted categories",
    };
  }
}
