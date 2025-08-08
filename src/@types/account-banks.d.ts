import { BANKS } from "@prisma/client";

export type AccountBankType = {
  id: string;
  bank: BANKS;
  description: string;
  amount: number;
};

type CreateAccountBankType = {
  bank: BANKS;
  description: string;
  amount: number;
};