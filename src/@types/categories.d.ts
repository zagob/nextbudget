import { Type } from "@prisma/client";

type CategoryType = {
  id: string;
  type: Type;
  name: string;
  color: string;
  _count: {
    user: number;
    Transactions: number;
  };
  totalAmountCategory: number;
};

type CreateCategoriesType = {
  name: string;
  type: Type;
  color: string;
};
