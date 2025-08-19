"use client";

import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { StatsCard } from "../StatsCard";
import { useQuery } from "@tanstack/react-query";
import { getResumeByDateTransactions } from "@/actions/transactions/getResumeByDateTransactions.actions";
import { transformToCurrency } from "@/lib/utils";
import { useDateFormatted } from "@/store/date";

export function DynamicStatsCards() {
  const date = useDateFormatted();
  const {
    data: transactions,
  } = useQuery({
    queryKey: ["resumeByDateTransactions", date],
    queryFn: async () => getResumeByDateTransactions({ date: new Date(date) }),
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatsCard
        title="Receitas (Mês)"
        value={transformToCurrency(transactions?.data?.income.current || 0)}
        change={transactions?.data?.income.change ?? "0%"}
        changeType={transactions?.data?.income.changeType}
        icon={TrendingUp}
        color="bg-gradient-to-br from-green-500 to-green-600"
      />
      <StatsCard
        title="Despesas (Mês)"
        value={transformToCurrency(
          transactions?.data?.expense.current || 0
        )}
        change={transactions?.data?.expense.change ?? "0%"}
        changeType={transactions?.data?.expense.changeType}
        icon={TrendingDown}
        color="bg-gradient-to-br from-red-500 to-red-600"
      />
      <StatsCard
        title="Balanço do Mês"
        value={transformToCurrency(transactions?.data?.balance.current || 0)}
        change={transactions?.data?.balance.change ?? "0%"}
        changeType={transactions?.data?.balance.changeType}
        icon={DollarSign}
        color="bg-gradient-to-br from-blue-500 to-blue-600"
      />

      {/* <StatsCard
          title="Categorias"
          value="0"
          change="--"
          icon={BarChart3}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        /> */}
    </div>
  );
}
