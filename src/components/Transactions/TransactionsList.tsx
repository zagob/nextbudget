"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, Calendar } from "lucide-react";
import { transformToCurrency } from "@/lib/utils";
import { LoadingCard } from "@/components/LoadingCard";
import { DialogCreateTransaction } from "@/components/DialogCreateTransaction";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TransactionItem } from "./TransactionItem";
import { useQuery } from "@tanstack/react-query";
import { getTransactionsGroupedDate } from "@/actions/transactions/getTransactionsGroupedDate.actions";
import { useDateOnly } from "@/store/date";

export function TransactionsList() {
  const date = useDateOnly();
  const { data: groupedTransactions, isPending: isPendingGrouped } = useQuery({
    queryKey: ["transactions-groupedDate", date],
    queryFn: async () =>
      await getTransactionsGroupedDate({
        date,
      }),
  });

  const sortedDates = useMemo(
    () =>
      Object.keys(groupedTransactions?.data || []).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
      ),
    [groupedTransactions]
  );

  if (isPendingGrouped) {
    return (
      <Card className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border-neutral-700/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-white">
            <Receipt className="w-5 h-5" />
            Transações do Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingCard />
        </CardContent>
      </Card>
    );
  }

  if (!groupedTransactions?.data || groupedTransactions.count === 0) {
    return (
      <Card className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border-neutral-700/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-white">
            <Receipt className="w-5 h-5" />
            Transações do Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Receipt className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Nenhuma transação encontrada
            </h3>
            <p className="text-neutral-400 mb-6">
              Comece adicionando suas primeiras transações do mês.
            </p>
            <DialogCreateTransaction />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border-neutral-700/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Transações do Mês
            <span className="text-sm font-normal text-neutral-400">
              ({groupedTransactions.count} transações)
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {sortedDates.map((dateKey) => {
          const day = groupedTransactions.data[dateKey];
          const dayTransactions = day.transactions;
          const date = parseISO(dateKey);

          const dayExpense = day.dayExpense;
          const dayIncome = day.dayIncome;

          return (
            <div
              key={dateKey}
              className="border border-neutral-600/30 rounded p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="size-5 text-blue-400" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {dayTransactions.length} transações
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  {dayIncome > 0 && (
                    <span className="text-green-400">
                      +{transformToCurrency(dayIncome)}
                    </span>
                  )}
                  {dayExpense > 0 && (
                    <span className="text-red-400">
                      -{transformToCurrency(dayExpense)}
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {dayTransactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
