import { BANKS, Type } from "@prisma/client";

type TransactionType = {
  id: string;
  type: Type;
  date: Date;
  description: string | null;
  amount: number;
  bank: {
    bank: BANKS;
  };
  category: {
    name: string;
    color: string;
  };
};

type CreateTransactionsType = {
  date: Date;
  accountBankId: string;
  categoryId: string;
  type: Type;
  description: string;
  amount: number;
};
