import { Type } from "@prisma/client";

type CategoryType = {
  id: string;
  type: Type;
  name: string;
  color: string;
  icon: string;
  _count: {
    user: number;
    Transactions: number;
  };
  totalAmountCategory: number;
};

type UpdateCategoryType = {
  id: string;
  name: string;
  type: Type;
  color: string;
};

type CreateCategoriesType = {
  name: string;
  type: Type;
  color: string;
};
