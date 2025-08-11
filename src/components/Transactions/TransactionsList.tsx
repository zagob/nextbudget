"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Receipt, 
  Calendar,
} from "lucide-react";
import { transformToCurrency } from "@/lib/utils";
import { LoadingCard } from "@/components/LoadingCard";
import { DialogCreateTransaction } from "@/components/DialogCreateTransaction";
import { TransactionType } from "@/@types/transactions";
import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TransactionItem } from "./TransactionItem";

interface TransactionsListProps {
  transactions: TransactionType[]
  isPending: boolean

}

interface GroupedTransactions {
  [key: string]: TransactionType[];
}



export function TransactionsList({ transactions, isPending }: TransactionsListProps) {

  // Memoizar agrupamento de transações
  const groupedTransactions: GroupedTransactions = useMemo(() => {
    return transactions.reduce((groups, transaction) => {
      let transactionDate: Date;
      
      if (transaction.date instanceof Date) {
        transactionDate = transaction.date;
      } else {
        transactionDate = new Date(transaction.date);
      }

      if (!isValid(transactionDate)) {
        console.warn('Invalid date found:', transaction.date);
        return groups;
      }

      const dateKey = format(transactionDate, "yyyy-MM-dd");
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
      
      return groups;
    }, {} as GroupedTransactions);
  }, [transactions]);

  // Memoizar datas ordenadas
  const sortedDates = useMemo(() => 
    Object.keys(groupedTransactions).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    ), [groupedTransactions]);

  if (isPending) {
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

  if (transactions.length === 0) {
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
              ({transactions.length} transações)
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {sortedDates.map((dateKey) => {
          const dayTransactions = groupedTransactions[dateKey];
          const date = new Date(dateKey);

          const dayIncome = dayTransactions
            .filter((t) => t.type === "INCOME")
            .reduce((sum, t) => sum + t.amount, 0);

          const dayExpense = dayTransactions
            .filter((t) => t.type === "EXPENSE")
            .reduce((sum, t) => sum + t.amount, 0);

          return (
            <div key={dateKey} className="space-y-3">
              {/* Day Header */}
              <div className="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg border border-neutral-600/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-400" />
                  </div>
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

              {/* Day Transactions */}
              <div className="space-y-2 ml-4">
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
