"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TransactionsList } from "@/components/Transactions/TransactionsList";
import { TransactionChart } from "@/components/Transactions/TransactionChart";
import { MonthSelector } from "@/components/Transactions/MonthSelector";
// import { TransactionStats } from "@/components/Transactions/TransactionStats";
import { Calendar, BarChart3, List, Filter } from "lucide-react";
import { DialogCreateTransaction } from "@/components/DialogCreateTransaction";
import { useDateOnly, useDateStore } from "@/store/date";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ResumeMonth } from "@/components/Transactions/ResumeMonth";

export default function TransactionsPage() {
  const selectedDate = useDateOnly();
  const setSelectedDate = useDateStore((state) => state.setDate);
  const [viewMode, setViewMode] = useState<"list" | "chart">("list");

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
        <div>
          <Button variant="outline">
            Exportar CSV
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
          <ResumeMonth />
        </div>
      </div>
    </div>
  );
}
