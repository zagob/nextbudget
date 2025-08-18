import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { formatAmountNegative, transformToCurrency } from "@/lib/utils";
import { useTransactionsData } from "@/hooks/useTransactionsData";
import { useDateOnly } from "@/store/date";

export function ResumeMonth() {
  const selectedDate = useDateOnly();
  const { transactions, isPendingTransactions, resume } =
    useTransactionsData(selectedDate);
    
  return (
    <Card className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border-neutral-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <BarChart3 className="w-5 h-5" />
          Resumo do Mês
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center p-4 bg-neutral-800/30 rounded-lg">
            <p className="text-sm text-neutral-400 mb-1">Total de Transações</p>
            <p className="text-2xl font-bold text-white">
              {transactions?.data?.length || 0}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-xs text-green-400 mb-1">Receitas</p>
              {isPendingTransactions ? (
                <Skeleton className="h-5 mt-1.5 w-1/2 text-center bg-green-900 rounded" />
              ) : (
                <p className="text-lg w-full flex justify-center font-semibold text-green-400">
                  {transformToCurrency(resume?.data?.totalAmountIncome || 0)}
                </p>
              )}
            </div>
            <div className="text-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-xs text-red-400 mb-1">Despesas</p>
              {isPendingTransactions ? (
                <Skeleton className="h-5 mt-1.5 w-1/2 text-center bg-green-900 rounded" />
              ) : (
                <p className="text-lg font-semibold text-red-400">
                  {transformToCurrency(resume?.data?.totalAmountExpenses || 0)}
                </p>
              )}
            </div>
          </div>
          <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-400 mb-1">Balanço</p>
            {isPendingTransactions ? (
              <Skeleton className="h-5 mt-1.5 w-1/2 text-center bg-green-900 rounded" />
            ) : (
              <p className="text-lg font-semibold text-blue-400">
                {formatAmountNegative(
                  transformToCurrency(resume?.data?.totalAmount || 0)
                )}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
