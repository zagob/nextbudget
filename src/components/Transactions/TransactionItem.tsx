"use client";

import { TransactionType } from "@/@types/transactions";
import { transformToCurrency } from "@/lib/utils";
import { MoreHorizontal, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DialogCreateTransactionCopy } from "../DialogCreateTransactionCopy";
import { DialogUpdateTransaction } from "../DialogUpdateTransaction";
import { DialogDeleteTransaction } from "../DialogDeleteTransaction";

export function TransactionItem({
  transaction,
}: {
  transaction: TransactionType;
}) {
  const isIncome = transaction.type === "INCOME";

  return (
    <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/50 transition-all duration-200 border border-neutral-700/30 hover:border-neutral-600/50">
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded"
          style={{ backgroundColor: `${transaction.category.color}20` }}
        >
          {isIncome ? (
            <TrendingUp
              className="w-4 h-4"
              style={{ color: transaction.category.color }}
            />
          ) : (
            <TrendingDown
              className="w-4 h-4"
              style={{ color: transaction.category.color }}
            />
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
                color: transaction.category.color,
              }}
            >
              {transaction.category.name}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>{transaction.bank}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-right">
          <p
            className={`text-sm font-semibold ${
              isIncome ? "text-green-400" : "text-red-400"
            }`}
          >
            {isIncome ? "+" : "-"} {transformToCurrency(transaction.amount)}
          </p>
        </div>

        <DropdownMenu modal>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-white/10"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="border flex items-center gap-1"
          >
            <DropdownMenuLabel className="border-r">Ações</DropdownMenuLabel>

            <DropdownMenuItem asChild>
              <DialogCreateTransactionCopy defaultValues={transaction} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DialogUpdateTransaction defaultValues={transaction} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DialogDeleteTransaction transactionId={transaction.id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
