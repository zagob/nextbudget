"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Receipt, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Eye,
  MoreHorizontal
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTransactionsByDate } from "@/actions/transactions/getTransactionsByDate.actions";
import { transformToCurrency } from "@/lib/utils";
import { LoadingCard } from "@/components/LoadingCard";
import { DialogCreateTransaction } from "@/components/DialogCreateTransaction";
import { TransactionType } from "@/@types/transactions";
import { format, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TransactionsListProps {
  selectedDate: Date;
}

interface GroupedTransactions {
  [key: string]: TransactionType[];
}

const TransactionItem = ({ transaction }: { transaction: TransactionType }) => {
  const isIncome = transaction.type === "INCOME";

  return (
    <div className="flex items-center justify-between p-3 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/50 transition-all duration-200 border border-neutral-700/30 hover:border-neutral-600/50">
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${transaction.category.color}20` }}
        >
          {isIncome ? (
            <TrendingUp className="w-4 h-4" style={{ color: transaction.category.color }} />
          ) : (
            <TrendingDown className="w-4 h-4" style={{ color: transaction.category.color }} />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-white">
              {transaction.description || transaction.category.name}
            </h4>
            <span 
              className="text-xs px-2 py-1 rounded-full"
              style={{ 
                backgroundColor: `${transaction.category.color}20`,
                color: transaction.category.color 
              }}
            >
              {transaction.category.name}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>{transaction.bank.bank}</span>
            <span>•</span>
            <span>
              {format(new Date(transaction.date), "HH:mm")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-right">
          <p className={`text-sm font-semibold ${
            isIncome ? 'text-green-400' : 'text-red-400'
          }`}>
            {isIncome ? '+' : '-'} {transformToCurrency(transaction.amount)}
          </p>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-white/10"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export function TransactionsList({ selectedDate }: TransactionsListProps) {
  const { data: transactions, isPending } = useQuery({
    queryKey: ["transactions-list", selectedDate.toISOString()],
    queryFn: async () => getTransactionsByDate({ date: selectedDate }),
  });

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

  const transactionsList = transactions?.data || [];

  // Group transactions by day
  const groupedTransactions: GroupedTransactions = transactionsList.reduce((groups, transaction) => {
    let transactionDate: Date;
    
    if (transaction.date instanceof Date) {
      transactionDate = transaction.date;
    } else {
      transactionDate = parseISO(transaction.date.toString());
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

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  if (transactionsList.length === 0) {
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
              ({transactionsList.length} transações)
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {sortedDates.map((dateKey) => {
          const dayTransactions = groupedTransactions[dateKey];
          const date = new Date(dateKey);
          
          const dayIncome = dayTransactions
            .filter(t => t.type === "INCOME")
            .reduce((sum, t) => sum + t.amount, 0);
          
          const dayExpense = dayTransactions
            .filter(t => t.type === "EXPENSE")
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