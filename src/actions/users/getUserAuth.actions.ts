"use server";

import { authOptions } from "@/lib/authConfig";
import { getServerSession } from "next-auth";

export async function getUserAuth() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new Error("User not found!");
    }

    const userId = session.user.id;

    return userId;
  } catch (err) {
    throw new Error('Failed authenticated', err as Error)
  }
}
