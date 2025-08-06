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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { BANKS, Type } from "@prisma/client";
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
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTransactions } from "@/actions/transactions/createTransactions.actions";
import { useDateStore } from "@/store/date";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ptBR } from "date-fns/locale";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

const formSchema = z.object({
  date: z.date(),
  type: z.enum(Type),
  accountBankId: z.string(),
  categoryId: z.string(),
  name: z.string(),
  description: z.string(),
  amount: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface DialogCreateTransactionProps {
  type?: Type;
}

export function DialogCreateTransaction({
  type = "EXPENSE",
}: DialogCreateTransactionProps) {
  const date = useDateStore((state) => state.date);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date,
      type,
      name: "",
      accountBankId: "",
      categoryId: "",
      description: "",
      amount: "R$ 0,00",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const amount = transformToCents(data.amount);
      await createTransactions({
        ...data,
        amount,
      });
    },
    onSuccess: () => {
      form.reset();
      toast.success("Transação criada com sucesso");
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
        <Button size="sm" variant="primary">
          <Plus className="w-4 h-4 mr-1" />
          Nova Transação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="mb-2">
              <DialogTitle>Nova Transação</DialogTitle>
              <DialogDescription>
                Crie uma nova transação para o dia {date.toLocaleDateString()}
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
                            // className={cn("", {
                            //   "pointer-events-none": field.value === "EXPENSE",
                            // })}
                          >
                            Saída
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="INCOME"
                            // className={cn("", {
                            //   "pointer-events-none": field.value === "INCOME",
                            // })}
                          >
                            Entrada
                          </ToggleGroupItem>
                          {/* <Button asChild className="">
                            <ToggleGroupItem value="EXPENSE">
                              Saída
                            </ToggleGroupItem>
                          </Button>
                          <Button asChild variant="primary" className="">
                            <ToggleGroupItem value="INCOME">
                              Entrada
                            </ToggleGroupItem>
                          </Button> */}
                        </ToggleGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                                "w-[240px] pl-3 text-left font-normal",
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
                              date > new Date() || date < new Date("2010-01-01")
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
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="name-bank" className="w-[200px]">
                            <SelectValue placeholder="Selecione um banco" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(BANKS).map((bank) => (
                              <SelectItem key={bank} value={bank}>
                                {bank}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input
                          id="description"
                          placeholder="Ex: Poupança"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Inicial</FormLabel>
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
