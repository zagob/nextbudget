import { Type } from "@prisma/client";

type CreateTransactionsType = {
  date: Date;
  accountBankId: string;
  categoryId: string;
  type: Type;
  description: string;
  amount: number;
};
