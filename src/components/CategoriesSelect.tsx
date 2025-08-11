"use client";

import { SelectProps } from "@radix-ui/react-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/actions/categories/getCategories.actions";
import { Skeleton } from "./ui/skeleton";
import { Type } from "@prisma/client";

interface CategoriasSelectProps extends SelectProps {
  id?: string;
  placeholder?: string;
  classNameTrigger?: string;
  type?: Type;
}

export function CategoriasSelect({
  id,
  placeholder,
  classNameTrigger,
  type = "EXPENSE",
  ...props
}: CategoriasSelectProps) {
  const { data: categories, isPending } = useQuery({
    queryKey: ["categories", type],
    queryFn: async () => await getCategories({ type }),
  });

  
  /**
   * Verificar se o array de categorias está vazio
   */
  const isEmptyCategories = categories?.data?.length === 0;

  return (
    <Select {...props}>
      <SelectTrigger
        disabled={isPending || isEmptyCategories}
        id={id}
        className={cn("w-[60%]", classNameTrigger)}
      >
        {isPending ? (
          <Skeleton className="h-2.5 w-full rounded" />
        ) : (
          <SelectValue
            placeholder={
              isEmptyCategories
                ? "Nenhuma Categoria encontrada"
                : placeholder || "Selecione uma categoria"
            }
          />
        )}
      </SelectTrigger>
      <SelectContent>
        {categories?.data?.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
