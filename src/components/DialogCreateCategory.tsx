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
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCategories } from "@/actions/categories/createCategories.actions";
import { TypeTransactionSelect } from "./TypeTransactionSelect";
import { Separator } from "./ui/separator";
import { PreviewItem } from "./PreviewCategory";

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
  const queryClient = useQueryClient()
  
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
      queryClient.invalidateQueries({ queryKey: ["categories"] });
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
                        <TypeTransactionSelect
                          type="single"
                          value={field.value}
                          onValueChange={field.onChange}
                        />
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
                            className=" w-16 rounded-md border border-neutral-600 bg-transparent p-1 cursor-pointer transition-colors duration-200 hover:border-neutral-400"
                            {...field}
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
