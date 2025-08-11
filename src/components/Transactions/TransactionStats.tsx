"use client";

import { Card, CardContent} from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTransactionsByDate } from "@/actions/transactions/getTransactionsByDate.actions";
import { transformToCurrency, formatAmountNegative } from "@/lib/utils";
import { LoadingCard } from "@/components/LoadingCard";

interface TransactionStatsProps {
  selectedDate: Date;
}

export function TransactionStats({ selectedDate }: TransactionStatsProps) {
  const { data: transactions, isPending } = useQuery({
    queryKey: ["transactions-stats", selectedDate.toISOString()],
    queryFn: async () => getTransactionsByDate({ date: selectedDate }),
  });

  if (isPending) {
    return <LoadingCard />;
  }

  const transactionsList = transactions?.data || [];
  
  const totalIncome = transactionsList
    .filter(t => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactionsList
    .filter(t => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpense;
  const totalTransactions = transactionsList.length;

  return (
    <div className="space-y-4">
      {/* Total Transactions */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Total de Transações</p>
              <p className="text-xl font-bold text-white">{totalTransactions}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Income */}
      <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Receitas</p>
              <p className="text-xl font-bold text-green-400">
                {transformToCurrency(totalIncome)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expense */}
      <Card className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border-red-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Despesas</p>
              <p className="text-xl font-bold text-red-400">
                {transformToCurrency(totalExpense)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balance */}
      <Card className={`bg-gradient-to-br ${
        balance >= 0 
          ? 'from-blue-500/10 to-cyan-500/10 border-blue-500/20' 
          : 'from-orange-500/10 to-red-500/10 border-orange-500/20'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              balance >= 0 ? 'bg-blue-500/20' : 'bg-orange-500/20'
            }`}>
              <DollarSign className={`w-5 h-5 ${
                balance >= 0 ? 'text-blue-400' : 'text-orange-400'
              }`} />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Saldo do Mês</p>
              <p className={`text-xl font-bold ${
                balance >= 0 ? 'text-blue-400' : 'text-orange-400'
              }`}>
                {formatAmountNegative(transformToCurrency(balance))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}