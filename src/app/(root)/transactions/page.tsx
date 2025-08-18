"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionsList } from "@/components/Transactions/TransactionsList";
import { TransactionChart } from "@/components/Transactions/TransactionChart";
import { MonthSelector } from "@/components/Transactions/MonthSelector";
// import { TransactionStats } from "@/components/Transactions/TransactionStats";
import { Calendar, BarChart3, List, Filter } from "lucide-react";
import { DialogCreateTransaction } from "@/components/DialogCreateTransaction";
import { useDateOnly, useDateStore } from "@/store/date";
import { useTransactionsData } from "@/hooks/useTransactionsData";
import { formatAmountNegative, transformToCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function TransactionsPage() {
  const selectedDate = useDateOnly();
  const setSelectedDate = useDateStore((state) => state.setDate);
  const [viewMode, setViewMode] = useState<"list" | "chart">("list");

  const { transactions, isPendingTransactions, resume } =
    useTransactionsData(selectedDate);

  return (
    <div className="py-4 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Transações</h1>
            <p className="text-neutral-400">
              Gerencie suas movimentações financeiras
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </div>
                {/* <div className="bg-blue-600 ml-4 rounded-full size-2" /> */}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">filtro aq</div>
            </PopoverContent>
          </Popover>
          <DialogCreateTransaction />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthSelector
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>
        {/* <TransactionStats selectedDate={selectedDate} /> */}
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-neutral-800/50 p-1 rounded-lg">
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="h-8"
          >
            <List className="w-4 h-4 mr-2" />
            Lista
          </Button>
          <Button
            variant={viewMode === "chart" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("chart")}
            className="h-8"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Gráfico
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {viewMode === "list" ? (
            <TransactionsList />
          ) : (
            <TransactionChart selectedDate={selectedDate} />
          )}
        </div>

        <div>
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
                  <p className="text-sm text-neutral-400 mb-1">
                    Total de Transações
                  </p>
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
                        {transformToCurrency(
                          resume?.data?.totalAmountIncome || 0
                        )}
                      </p>
                    )}
                  </div>
                  <div className="text-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-xs text-red-400 mb-1">Despesas</p>
                    {isPendingTransactions ? (
                      <Skeleton className="h-5 mt-1.5 w-1/2 text-center bg-green-900 rounded" />
                    ) : (
                      <p className="text-lg font-semibold text-red-400">
                        {transformToCurrency(
                          resume?.data?.totalAmountExpenses || 0
                        )}
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
        </div>
      </div>
    </div>
  );
}
