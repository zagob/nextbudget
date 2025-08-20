/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTransactionsByDate } from "@/actions/transactions/getTransactionsByDate.actions";
import { transformToCurrency } from "@/lib/utils";
import { LoadingCard } from "@/components/LoadingCard";
import { DialogCreateTransaction } from "@/components/DialogCreateTransaction";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

interface TransactionChartProps {
  selectedDate: Date;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
  type: "INCOME" | "EXPENSE";
  count: number;
}

interface DayData {
  day: string;
  income: number;
  expense: number;
  balance: number;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-neutral-800 border border-neutral-700 p-3 rounded-lg shadow-lg">
        <p className="text-white font-medium">{data.name}</p>
        <p className="text-neutral-300">
          Valor:{" "}
          <span className="font-semibold">
            {transformToCurrency(data.value)}
          </span>
        </p>
        <p className="text-neutral-300">
          Transações: <span className="font-semibold">{data.count}</span>
        </p>
      </div>
    );
  }
  return null;
};

const DayTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-800 border border-neutral-700 p-3 rounded-lg shadow-lg">
        <p className="text-white font-medium">Dia {label}</p>
        {payload.map(
          (
            entry: { dataKey: string; color: string; value: number },
            index: number
          ) => (
            <p key={index} className="text-neutral-300">
              <span style={{ color: entry.color }}>
                {entry.dataKey === "income"
                  ? "Receitas"
                  : entry.dataKey === "expense"
                  ? "Despesas"
                  : "Saldo"}
                :
              </span>{" "}
              <span className="font-semibold">
                {transformToCurrency(entry.value)}
              </span>
            </p>
          )
        )}
      </div>
    );
  }
  return null;
};

export function TransactionChart({ selectedDate }: TransactionChartProps) {
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

  const { data: transactions, isPending } = useQuery({
    queryKey: ["transactions-chart", selectedDate.toISOString()],
    queryFn: async () => getTransactionsByDate({ date: selectedDate }),
  });

  const transactionsList = useMemo(
    () => transactions?.data || [],
    [transactions]
  );

  // Memoizar dados das categorias
  const categoryData: CategoryData[] = useMemo(() => {
    return Object.values(
      transactionsList.reduce((acc, transaction) => {
        const key = `${transaction.category.name}-${transaction.type}`;
        if (!acc[key]) {
          acc[key] = {
            name: transaction.category.name,
            value: 0,
            color: transaction.category.color,
            type: transaction.type,
            count: 0,
          };
        }
        acc[key].value += transaction.amount;
        acc[key].count += 1;
        return acc;
      }, {} as Record<string, CategoryData>)
    ).sort((a, b) => b.value - a.value);
  }, [transactionsList]);

  // Memoizar dados por dia
  const dayData: DayData[] = useMemo(() => {
    return Object.values(
      transactionsList.reduce((acc, transaction) => {
        const date = new Date(transaction.date);
        const day = date.getDate().toString();

        if (!acc[day]) {
          acc[day] = {
            day,
            income: 0,
            expense: 0,
            balance: 0,
          };
        }

        if (transaction.type === "INCOME") {
          acc[day].income += transaction.amount;
        } else {
          acc[day].expense += transaction.amount;
        }

        acc[day].balance = acc[day].income - acc[day].expense;
        return acc;
      }, {} as Record<string, DayData>)
    ).sort((a, b) => parseInt(a.day) - parseInt(b.day));
  }, [transactionsList]);

  if (isPending) {
    return (
      <Card className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border-neutral-700/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-white">
            <BarChart3 className="w-5 h-5" />
            Análise por Categorias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingCard />
        </CardContent>
      </Card>
    );
  }

  if (transactionsList.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border-neutral-700/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-white">
            <BarChart3 className="w-5 h-5" />
            Análise por Categorias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Nenhum dado para análise
            </h3>
            <p className="text-neutral-400 mb-6">
              Adicione transações para visualizar gráficos e análises.
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <BarChart3 className="w-5 h-5" />
            Análise por Categorias
          </CardTitle>

          <div className="flex items-center gap-2 bg-neutral-800/50 p-1 rounded-lg">
            <Button
              variant={chartType === "pie" ? "default" : "ghost"}
              size="sm"
              onClick={() => setChartType("pie")}
              className="h-8"
            >
              <PieChartIcon className="w-4 h-4 mr-2" />
              Pizza
            </Button>
            <Button
              variant={chartType === "bar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setChartType("bar")}
              className="h-8"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Barras
            </Button>

            {/* 
              1. Linha (Line chart)
                  Para mostrar evolução no tempo (ex: saldo, despesas ou receitas mês a mês).
                  Bom para identificar tendências (crescimento, queda, sazonalidade).
            */}

            {/* 
              2. Área (Area chart)
                  Similar ao de linha, mas com preenchimento.
                  Útil para mostrar a proporção acumulada (ex: evolução do saldo ao longo dos meses).
            */}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {chartType === "pie" ? (
          <>
            {/* Pie Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category Legend */}
            <div className="grid grid-cols-1 gap-3">
              {categoryData.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-neutral-800/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-white font-medium">
                        {category.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {category.type === "INCOME" ? (
                        <TrendingUp className="w-3 h-3 text-green-400" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-400" />
                      )}
                      <span className="text-xs text-neutral-400">
                        {category.type === "INCOME" ? "Receita" : "Despesa"}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-white font-semibold">
                      {transformToCurrency(category.value)}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {category.count} transações
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Bar Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dayData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                  <YAxis
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) =>
                      `R$ ${(value / 1000).toFixed(0)}k`
                    }
                  />
                  <Tooltip content={<DayTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="income"
                    fill="#10B981"
                    name="Receitas"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="expense"
                    fill="#EF4444"
                    name="Despesas"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400 font-medium">
                    Receitas Totais
                  </span>
                </div>
                <p className="text-xl font-bold text-green-400">
                  {transformToCurrency(
                    transactionsList
                      .filter((t) => t.type === "INCOME")
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </p>
              </div>

              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400 font-medium">
                    Despesas Totais
                  </span>
                </div>
                <p className="text-xl font-bold text-red-400">
                  {transformToCurrency(
                    transactionsList
                      .filter((t) => t.type === "EXPENSE")
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
