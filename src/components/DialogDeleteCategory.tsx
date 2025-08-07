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
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { deleteCategories } from "@/actions/categories/deleteCategories.actions";

interface DialogDeleteCategoryProps {
  onOpenChange: (open: boolean) => void;
  categoryId: string;
}

export function DialogDeleteCategory({
  onOpenChange,
  categoryId,
}: DialogDeleteCategoryProps) {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await deleteCategories({ categoryId });
    },
    onSuccess: () => {
      toast.success("Categoria excluida com sucesso");
      setOpen(false);
      onOpenChange(false)
    },
    onError: () => {
      toast.error("Erro ao excluir categoria, tente novamente");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          Excluir
        </Button>
      </DialogTrigger>
      {open && (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="mb-2">
            <DialogTitle>Excluir Categoria</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir essa categoria?
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
