import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
// import { prisma } from "./prisma";

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database' },
  secret: process.env.NEXTAUTH_SECRET!,
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token?.sub) {
        session.user.id = token.sub ?? "";
      }

      return session;
    },
  },
};
