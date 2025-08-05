import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";
import { CreateCategoriesType } from "@/@types/categories";

export async function createCategories({
  color,
  name,
  type,
}: CreateCategoriesType) {
  try {
    const userId = await getUserAuth();

    await prisma.categories.create({
      data: {
        userId,
        name,
        type,
        color,
      },
    });
    return {
      success: true,
      message: "Categories created successfully",
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: (error as Error).message || "Failed to create categories",
    };
  }
}
