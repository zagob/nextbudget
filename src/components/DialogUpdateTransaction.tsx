"use client";

import { CalendarIcon, Pencil } from "lucide-react";
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
import {
  cn,
  transformToCents,
  transformToCurrency,
  validationInputAmount,
} from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ptBR } from "date-fns/locale";
import { CategoriasSelect } from "./CategoriesSelect";
import { DialogCreateCategory } from "./DialogCreateCategory";
import { BanksSelect } from "./BanksSelect";
import useDateStoreFormatted from "@/hooks/useDateStoreFormatted";
import { TypeTransactionSelect } from "./TypeTransactionSelect";
import { updateTransactions } from "@/actions/transactions/updateTransactions.actions";
import { TransactionType } from "@/@types/transactions";

const formSchema = z.object({
  id: z.string(),
  date: z.date("Date must be a valid date"),
  type: z.enum(Type),
  accountBankId: z.string(),
  categoryId: z.string(),
  description: z.string(),
  amount: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface DialogUpdateTransactionProps {
  defaultValues: TransactionType;
}

export function DialogUpdateTransaction({
  defaultValues,
}: DialogUpdateTransactionProps) {
  const queryClient = useQueryClient();
  const dateFormatted = useDateStoreFormatted();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: defaultValues.date,
      type: defaultValues.type,
      accountBankId: defaultValues.accountBankId,
      categoryId: defaultValues.categoryId,
      description: defaultValues.description || "",
      amount: transformToCurrency(defaultValues.amount),
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const amount = transformToCents(data.amount);
      await updateTransactions({
        transactionId: data.id,
        data: {
          ...data,
          amount,
        },
      });
    },
    onSuccess: () => {
      form.reset();
      toast.success("Transação atualizada com sucesso", {
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
      queryClient.invalidateQueries({
        queryKey: ["account-banks"],
      });
    },
    onError: () => {
      toast.error("Erro ao atualizar transação, tente novamente", {
        richColors: true,
      });
    },
  });

  async function onSubmit(data: FormData) {
    mutate(data);
  }

  function handleValidationInput(event: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = event.target.value;
    const formatted = validationInputAmount(rawValue);
    event.target.value = formatted;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="size-7 p-0 hover:bg-white/10"
        >
          <Pencil className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="mb-2">
              <DialogTitle>Atualizar Transação</DialogTitle>
              <DialogDescription>
                Atualize as informações da transação
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
                          onValueChange={(value) => {
                            form.setValue("categoryId", "");
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data da transação</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", {
                                    locale: ptBR,
                                  })
                                ) : (
                                  <span>Selecione uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              locale={ptBR}
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("2010-01-01")
                              }
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accountBankId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banco</FormLabel>
                        <FormControl>
                          <BanksSelect
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <CategoriasSelect
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Selecione uma categoria"
                            type={form.watch("type")}
                          />
                          <DialogCreateCategory type={form.watch("type")} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid sm:grid-cols-[auto_0.6fr] gap-3">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Input
                            id="description"
                            placeholder="Ex: Mercado"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0,00"
                            onInput={handleValidationInput}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button disabled={isPending} variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  disabled={isPending}
                  variant="secondary"
                  type="submit"
                  className="disabled:cursor-not-allowed"
                >
                  {isPending ? "Atualizando..." : "Atualizar"}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
