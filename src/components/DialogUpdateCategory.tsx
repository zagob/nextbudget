"use client";

import { Pencil } from "lucide-react";
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
import { Input } from "./ui/input";
import { Type } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { CategoryType } from "@/@types/categories";
import { useState } from "react";
import { updateCategories } from "@/actions/categories/updateCategories.actions";
import { PreviewItem } from "./PreviewCategory";
import { Separator } from "./ui/separator";
import { DialogDeleteCategory } from "./DialogDeleteCategory";

const formSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(Type),
  color: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface DialogUpdateCategoryProps {
  category: CategoryType;
}

export function DialogUpdateCategory({ category }: DialogUpdateCategoryProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name,
      color: category.color,
      type: category.type,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      await updateCategories(data);
    },
    onSuccess: () => {
      form.reset();
      toast.success("Categoria atualizada com sucesso");
    },
    onError: () => {
      toast.error("Erro ao atualizar categoria, tente novamente");
    },
  });

  async function onSubmit(data: FormData) {
    mutate(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-white/10"
        >
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      {open && (
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader className="mb-2">
                <DialogTitle>Atualizar Categoria</DialogTitle>
                <DialogDescription>
                  Atualize a categoria para gerenciar suas transações
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <FormControl>
                          <ToggleGroup
                            type="single"
                            defaultValue={field.value}
                            className="border w-full cursor-not-allowed"
                            orientation="horizontal"
                            disabled
                          >
                            <ToggleGroupItem
                              value="EXPENSE"
                              className={cn(
                                "pointer-events-none data-[state=on]:bg-red-400"
                              )}
                            >
                              Saída
                            </ToggleGroupItem>
                            <ToggleGroupItem
                              value="INCOME"
                              className={cn(
                                "pointer-events-none data-[state=on]:bg-green-400"
                              )}
                            >
                              Entrada
                            </ToggleGroupItem>
                          </ToggleGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-3 sm:grid-cols-[auto_0.5fr]">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da categoria</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cor</FormLabel>
                          <FormControl>
                            <Input
                              type="color"
                              {...field}
                              className=" w-16 rounded-md border border-neutral-600 bg-transparent p-1 cursor-pointer transition-colors duration-200 hover:border-neutral-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <Separator />
                <div className="grid gap-2">
                  <h3>Visualização da categoria</h3>
                  <PreviewItem
                    category={{
                      name: form.watch("name"),
                      color: form.watch("color"),
                      type: form.watch("type"),
                    }}
                  />
                </div>
                <DialogFooter className="flex w-full items-center justify-between">
                  <DialogDeleteCategory
                    onOpenChange={setOpen}
                    categoryId={category.id}
                  />

                  <div className="flex items-center gap-2">
                    <DialogClose asChild>
                      <Button disabled={isPending} variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      disabled={isPending}
                      variant="secondary"
                      type="submit"
                    >
                      {isPending ? "Atualizando..." : "Atualizar"}
                    </Button>
                  </div>
                </DialogFooter>
              </div>
            </form>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  );
}
