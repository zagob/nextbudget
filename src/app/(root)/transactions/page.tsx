"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionsList } from "@/components/Transactions/TransactionsList";
import { TransactionChart } from "@/components/Transactions/TransactionChart";
import { MonthSelector } from "@/components/Transactions/MonthSelector";
import { TransactionStats } from "@/components/Transactions/TransactionStats";
import { Calendar, BarChart3, List, Filter } from "lucide-react";
import { DialogCreateTransaction } from "@/components/DialogCreateTransaction";

export default function TransactionsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"list" | "chart">("list");

  return (
    <div className="py-4 space-y-6">
      {/* Header */}
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
          <Button
            variant="outline"
            size="sm"
            className="border-neutral-700 hover:bg-neutral-800"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <DialogCreateTransaction />
        </div>
      </div>

      {/* Month Selector and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthSelector
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>
        <div>{/* <TransactionStats selectedDate={selectedDate} /> */}</div>
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
            <TransactionsList selectedDate={selectedDate} />
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
                  <p className="text-2xl font-bold text-white">0</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-xs text-green-400 mb-1">Receitas</p>
                    <p className="text-lg font-semibold text-green-400">
                      R$ 0,00
                    </p>
                  </div>
                  <div className="text-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-xs text-red-400 mb-1">Despesas</p>
                    <p className="text-lg font-semibold text-red-400">
                      R$ 0,00
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
