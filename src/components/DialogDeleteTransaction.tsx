"use client";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { deleteTransactions } from "@/actions/transactions/deleteTransactions.actions";
import { Trash } from "lucide-react";
import { usePathname } from "next/navigation";
import { useDateFormatted } from "@/store/date";

interface DialogDeleteTransactionProps {
  transactionId: string;
}

export function DialogDeleteTransaction({
  transactionId,
}: DialogDeleteTransactionProps) {
  const dateFormatted = useDateFormatted();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await deleteTransactions({ transactionId });
    },
    onSuccess: () => {
      toast.success("Transação excluida com sucesso", {
        richColors: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["transactions", dateFormatted],
      });
      queryClient.invalidateQueries({
        queryKey: ["resumeByDateTransactions", dateFormatted],
      });
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      queryClient.invalidateQueries({
        queryKey: ["resume-transactions"],
      });

      if (pathname === "/") {
        queryClient.invalidateQueries({
          queryKey: ["account-banks"],
        });
      }

      if (pathname === "/transactions") {
        queryClient.invalidateQueries({
          queryKey: ["transactions-groupedDate"],
        });
      }

      setOpen(false);
    },
    onError: () => {
      toast.error("Erro ao excluir transação, tente novamente", {
        richColors: true,
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="xs" variant="destructive" className="rounded">
          <Trash className="text-white" />
        </Button>
      </DialogTrigger>
      {open && (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="mb-2">
            <DialogTitle>Excluir Transação</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir essa transação?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <DialogFooter>
              <DialogClose asChild>
                <Button disabled={isPending} variant="outline">
                  Não
                </Button>
              </DialogClose>
              <Button
                disabled={isPending}
                variant="secondary"
                onClick={() => mutate()}
              >
                {isPending ? "Excluindo..." : "Sim"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
