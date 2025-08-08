"use client";

import { Settings } from "lucide-react";
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
import { BANKS } from "@prisma/client";
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
import { transformToCents, validationInputAmount } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateBanks } from "@/actions/banks/updateBanks.actions";
import { getTransactionsByAccountBankId } from "@/actions/transactions/getTransactionsByAccountBankId.actions";

const formSchema = z.object({
  bank: z.enum(BANKS),
  description: z
    .string()
    .nonempty({ message: "O campo descrição é obrigatorio" }),
  amount: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface DialogUpdateAccountBankProps {
  accountBankId: string;
  defaultValues: FormData;
}

export function DialogUpdateAccountBank({
  accountBankId,
  defaultValues,
}: DialogUpdateAccountBankProps) {
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { data: transactions } = useQuery({
    queryKey: ["transactions-by-accountBankId", accountBankId],
    queryFn: async () =>
      await getTransactionsByAccountBankId({
        accountBankId,
      }),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const amount = transformToCents(data.amount);
      await updateBanks({ bankId: accountBankId, data: { ...data, amount } });
    },
    onSuccess: () => {
      toast.success("Banco atualizado com sucesso", {
        richColors: true,
      });
      queryClient.invalidateQueries({ queryKey: ["account-banks"] });
    },
    onError: (err) => {
      console.log(err);
      toast.error("Erro ao atualizar banco, tente novamente", {
        richColors: true,
      });
    },
  });

  async function onSubmit(data: FormData) {
    const updatedAmount = data.amount !== defaultValues.amount;
    const updatedAccountBank = data.bank !== defaultValues.bank;
    if (transactions?.data?.exists && (data.amount && updatedAmount || updatedAccountBank)) {
      return toast.error(
        "Banco possui transações vinculadas, se deseja atualizar, remova as transações",
        {
          richColors: true,
        }
      );
    }

    const newData = {
      ...data,
      amount: data.amount ? data.amount : defaultValues.amount,
      bank: data.bank ? data.bank : defaultValues.bank,      
    }

    mutate(newData);
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
          className="h-6 w-6 p-0 hover:bg-white/10"
        >
          <Settings className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="mb-2">
              <DialogTitle>Novo Banco</DialogTitle>
              <DialogDescription>
                {transactions?.data?.exists ? (
                  <>
                    <span className="text-red-400 font-bold">Atenção:</span>

                    <span className="text-red-300 text-xs">
                      {" "}
                      Banco possui {transactions?.data?.count} transações vinculadas, se deseja atualizar
                      dados especificos, remova as transações
                    </span>
                  </>
                ) : (
                  "Atualização dos dados do banco"
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="bank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banco</FormLabel>
                      <FormControl>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          disabled={transactions?.data?.exists}
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
                  disabled={transactions?.data?.exists}
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
                <Button
                  disabled={isPending || transactions?.data?.exists && form.watch('description') === defaultValues.description}
                  variant="secondary"
                  type="submit"
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
