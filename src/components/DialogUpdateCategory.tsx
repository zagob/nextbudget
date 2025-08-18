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
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UpdateCategoryType } from "@/@types/categories";
import { useState } from "react";
import { updateCategories } from "@/actions/categories/updateCategories.actions";
import { PreviewItem } from "./PreviewCategory";
import { Separator } from "./ui/separator";
import { DialogDeleteCategory } from "./DialogDeleteCategory";
import { TypeTransactionSelect } from "./TypeTransactionSelect";
import { SelectIcons } from "./SelectIcons";
import { SelectIconsExample } from "./SelectIconsExample";

const formSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(Type),
  color: z.string(),
  icon: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface DialogUpdateCategoryProps {
  category: UpdateCategoryType;
}

export function DialogUpdateCategory({ category }: DialogUpdateCategoryProps) {
  const [open, setOpen] = useState(false);

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
        <DialogUpdateCategoryContent
          category={category}
          open={open}
          setOpen={setOpen}
        />
      )}
    </Dialog>
  );
}

interface DialogUpdateCategoryContentProps extends DialogUpdateCategoryProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogUpdateCategoryContent = ({
  category,
  setOpen,
}: DialogUpdateCategoryContentProps) => {
  const queryClient = useQueryClient();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: category.id,
      name: category.name,
      color: category.color,
      type: category.type,
      // icon: category.icon,
    },
  });

  console.log(form.watch("icon"));

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      await updateCategories(data);
    },
    onSuccess: () => {
      toast.success("Categoria atualizada com sucesso", {
        richColors: true,
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Erro ao atualizar categoria, tente novamente", {
        richColors: true,
      });
    },
  });

  async function onSubmit(data: FormData) {
    console.log(data);
    mutate(data);
  }

  console.log(form.formState.errors);
  return (
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
                      <TypeTransactionSelect
                        type="single"
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled
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
                          {...field}
                          className=" w-16 rounded-md border border-neutral-600 bg-transparent p-1 cursor-pointer transition-colors duration-200 hover:border-neutral-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ícone</FormLabel>
                    <FormControl>
                      <SelectIcons
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Escolha um ícone..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>
            <Separator />
            <div className="grid gap-2">
              <h3>Visualização da categoria</h3>
              <PreviewItem
                category={{
                  name: form.watch("name"),
                  color: form.watch("color"),
                  type: form.watch("type"),
                  icon: form.watch("icon"),
                }}
              />
            </div>
            <DialogFooter className="grid grid-cols-2">
              <div>
                <DialogDeleteCategory
                  onOpenChange={setOpen}
                  categoryId={category.id}
                />
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <DialogClose asChild>
                  <Button disabled={isPending} variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button disabled={isPending} variant="secondary" type="submit">
                  {isPending ? "Atualizando..." : "Atualizar"}
                </Button>
              </div>
            </DialogFooter>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};
