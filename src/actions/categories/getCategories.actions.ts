"use server"

import { prisma } from "@/lib/prisma";
import { getUserAuth } from "../users/getUserAuth.actions";

export async function getCategories() {
  try {
    const userId = await getUserAuth();

    const categories = await prisma.categories.findMany({
      where: {
        userId,
        // Transactions: {
        //     every: {
        //         date
        //     }
        // }
      },
      select: {
        id: true,
        type: true,
        name: true,
        color: true,
        _count: true,
        // Transactions: true
      }
    });
    return {
      success: true,
      message: "Categories geted successfully",
      data: categories,
    };
  } catch (error) {
    return {
      error,
      success: false,
      message: (error as Error).message || "Failed to get categories",
    };
  }
}
