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
import { createBanks } from "@/actions/banks/createBanks.actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const formSchema = z.object({
  bank: z.enum(BANKS),
  description: z
    .string()
    .nonempty({ message: "O campo descrição é obrigatorio" }),
  amount: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export function DialogCreateAccountBank() {
  const queryClient = useQueryClient()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bank: "OUTROS",
      description: "",
      amount: "R$ 0,00",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const amount = transformToCents(data.amount);
      await createBanks({ data: { ...data, amount } });
    },
    onSuccess: () => {
      form.reset();
      toast.success("Banco criado com sucesso", {
        richColors: true,
      });
      queryClient.invalidateQueries({ queryKey: ["account-banks"] });
    },
    onError: () => {
      toast.error("Erro ao criar banco, tente novamente", {
        richColors: true
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
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-zinc-50"
        >
          <Plus className="w-4 h-4 mr-1" />
          Nova Conta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="mb-2">
              <DialogTitle>Novo Banco</DialogTitle>
              <DialogDescription>
                Crie um novo banco e adicione as suas contas.
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
