"use client";

import { CalendarIcon, Plus } from "lucide-react";
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
import { cn, transformToCents, validationInputAmount } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDateStore } from "@/store/date";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ptBR } from "date-fns/locale";
import { BanksSelect } from "./BanksSelect";
import useDateStoreFormatted from "@/hooks/useDateStoreFormatted";
import { usePathname } from "next/navigation";
import { createTransfer } from "@/actions/transfers/createTransfer.actions";

const formSchema = z.object({
  date: z.date("Date must be a valid date"),
  sourceBankId: z.string(),
  destinationBankId: z.string(),
  description: z.string(),
  amount: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export function DialogCreateTransfer() {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const dateFormatted = useDateStoreFormatted();
  const date = useDateStore((state) => state.date);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date,
      description: "",
      sourceBankId: "",
      destinationBankId: "",
      amount: "R$ 0,00",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const amount = transformToCents(data.amount);
      await createTransfer({
        ...data,
        amount,
      });
    },
    onSuccess: () => {
      form.reset();
      toast.success("Transferência criada com sucesso", {
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

      if (pathname === "/transactions") {
        queryClient.invalidateQueries({
          queryKey: ["transactions-groupedDate"],
        });
      }
    },
    onError: () => {
      toast.error("Erro ao criar transação, tente novamente");
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
        <Button size="sm" variant="primary" className="rounded">
          <Plus className="size-4 mr-1" />
          Nova Transferência
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="mb-2">
              <DialogTitle>Nova Transferência</DialogTitle>
              <DialogDescription>
                Crie uma nova transferência para o dia{" "}
                {date.toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
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
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="sourceBankId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banco Origem</FormLabel>
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
                  <FormField
                    control={form.control}
                    name="destinationBankId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banco Destino</FormLabel>
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
                  {isPending ? "Transferindo..." : "Transferir"}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
