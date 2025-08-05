import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart3 } from "lucide-react";
import { transformToCurrency } from "@/lib/utils";

export const HistoricStatsCard = memo(({ transactions }: { transactions?: any[] }) => {
  const incomeTransactions = transactions?.filter((t: any) => t.type === 'INCOME');
  const expenseTransactions = transactions?.filter((t: any) => t.type === 'EXPENSE');
  const totalIncome = incomeTransactions?.reduce((sum: number, t: any) => sum + (t.value || 0), 0);
  const totalExpenses = expenseTransactions?.reduce((sum: number, t: any) => sum + (t.value || 0), 0);
  const netBalance = totalIncome - totalExpenses;

  return (
    <Card className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border-neutral-700/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white">
          <BarChart3 className="w-5 h-5" />
          Histórico Geral
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-400">Receitas Totais</span>
          <span className="text-green-400 font-medium">{transformToCurrency(totalIncome)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-400">Despesas Totais</span>
          <span className="text-red-400 font-medium">{transformToCurrency(totalExpenses)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-400">Saldo Acumulado</span>
          <span className="text-blue-400 font-medium">{transformToCurrency(netBalance)}</span>
        </div>
      </CardContent>
    </Card>
  );
});

HistoricStatsCard.displayName = "HistoricStatsCard";