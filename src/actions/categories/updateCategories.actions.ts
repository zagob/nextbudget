"use server";

import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";
import { CategoryType } from "@/@types/categories";

export async function updateCategories({
  color,
  name,
  type,
  id,
}: CategoryType) {
  try {
    const userId = await getUserAuth();

    const existingCategory = await prisma.categories.findUnique({
      where: {
        userId,
        id,
      },
      select: {
        type: true,
      },
    });

    if (existingCategory?.type !== type) {
      throw new Error("Category type cannot be changed");
    }

    await prisma.categories.update({
      where: {
        userId,
        id,
      },
      data: {
        name,
        type,
        color,
      },
    });
    return {
      success: true,
      message: "Categories updated successfully",
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: (error as Error).message || "Failed to update categories",
    };
  }
}
