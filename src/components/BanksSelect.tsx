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
import { Skeleton } from "./ui/skeleton";
import { getBanks } from "@/actions/banks/getBanks.actions";

interface BanksSelectProps extends SelectProps {
  id?: string;
  placeholder?: string;
  classNameTrigger?: string;
}

export function BanksSelect({
  id,
  placeholder,
  classNameTrigger,
  ...props
}: BanksSelectProps) {
  const { data: banks, isPending } = useQuery({
    queryKey: ["banks"],
    queryFn: async () => await getBanks(),
  });

  const isEmptyBanks = banks?.data?.banks?.length === 0;

  return (
    <Select {...props}>
      <SelectTrigger
        disabled={isPending || isEmptyBanks}
        id={id}
        className={cn(isPending ? "w-1/2" : "w-fit", classNameTrigger)}
      >
        {isPending ? (
          <Skeleton className="h-2.5 w-full rounded" />
        ) : (
          <SelectValue
            placeholder={
              isEmptyBanks
                ? "Nenhum Banco cadastrado"
                : placeholder || "Selecione um banco"
            }
          />
        )}
      </SelectTrigger>
      <SelectContent>
        {banks?.data?.banks.map((bank) => (
          <SelectItem key={bank.id} value={bank.id}>
            {bank.bank}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
