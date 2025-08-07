import { Type } from "@prisma/client";

type CategoryType = {
  id: string
  type: Type;
  name: string;
  color: string;
}

type CreateCategoriesType = {
  name: string;
  type: Type;
  color: string;
};
