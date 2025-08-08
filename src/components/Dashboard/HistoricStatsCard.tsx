"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart3 } from "lucide-react";
import { formatAmountNegative, transformToCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getResumeTransactions } from "@/actions/transactions/getResumeTransactions.actions";

export const HistoricStatsCard = memo(() => {
  const { data: resume } = useQuery({
    queryKey: ["resume-transactions"],
    queryFn: async () => await getResumeTransactions(),
  });

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
          <span className="text-green-400 font-medium">
            {transformToCurrency(resume?.data?.totalAmountIncome || 0)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-400">Despesas Totais</span>
          <span className="text-red-400 font-medium">
            {transformToCurrency(resume?.data?.totalAmountExpenses || 0)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-400">Saldo Acumulado</span>
          <span className="text-blue-400 font-medium">
            {formatAmountNegative(
              transformToCurrency(resume?.data?.totalAmount || 0)
            )}
          </span>
        </div>
      </CardContent>
    </Card>
  );
});

HistoricStatsCard.displayName = "HistoricStatsCard";
