"use client";

import { Plus } from "lucide-react";
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
import { useDateStore } from "@/store/date";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { createCategories } from "@/actions/categories/createCategories.actions";

const formSchema = z.object({
  name: z.string(),
  type: z.enum(Type),
  color: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface DialogCreateCategoryProps {
  type?: Type;
}

export function DialogCreateCategory({
  type = "EXPENSE",
}: DialogCreateCategoryProps) {
  const date = useDateStore((state) => state.date);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: "",
      type,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      await createCategories(data);
    },
    onSuccess: () => {
      form.reset();
      toast.success("Categoria criada com sucesso");
    },
    onError: () => {
      toast.error("Erro ao criar categoria, tente novamente");
    },
  });

  async function onSubmit(data: FormData) {
    mutate(data);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="primary" className="rounded">
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="mb-2">
              <DialogTitle>Nova Categoria</DialogTitle>
              <DialogDescription>
                Crie uma nova categoria para gerenciar suas transações
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
                          value={field.value}
                          onValueChange={field.onChange}
                          className="border w-full"
                          orientation="horizontal"
                        >
                          <ToggleGroupItem
                            value="EXPENSE"
                            className={cn("", {
                              "pointer-events-none": field.value === "EXPENSE",
                            })}
                          >
                            Saída
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="INCOME"
                            className={cn("", {
                              "pointer-events-none": field.value === "INCOME",
                            })}
                          >
                            Entrada
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                        <Input type="color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button disabled={isPending} variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button disabled={isPending} variant="secondary" type="submit">
                  {isPending ? "Criando..." : "Criar"}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
