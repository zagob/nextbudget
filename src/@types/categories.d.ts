import { Type } from "@prisma/client";

type CreateCategoriesType = {
  name: string;
  type: Type;
  color: string;
};
