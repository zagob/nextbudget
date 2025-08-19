import { getBankIcon, getGradientClass } from "@/constants/banks";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { memo } from "react";
import { Eye, EyeOff, TrendingUp } from "lucide-react";
import { transformToCurrency } from "@/lib/utils";
import { AccountBankType } from "@/@types/account-banks";
import { DialogUpdateAccountBank } from "../DialogUpdateAccountBank";

interface AccountBankProps {
  account: AccountBankType;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const AccountBank = memo(
  ({ account, isVisible, onToggleVisibility }: AccountBankProps) => {

    
    return (
      <Card
        className={`bg-gradient-to-br rounded ${getGradientClass(
          account.bank
        )} hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-neutral-900/20`}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {getBankIcon(account.bank)}
              <div>
                <h3 className="font-semibold text-white text-sm">
                  {account.description}
                </h3>
                <p className="text-xs text-neutral-400">{account.bank}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleVisibility}
              className="h-8 w-8 p-0 hover:bg-white/10"
            >
              {isVisible ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Saldo</span>
              <span className="text-lg font-bold text-white">
                {isVisible ? transformToCurrency(account.amount) : "••••••"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Tipo</span>
              <span className="text-neutral-300">{account.bank}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Descrição</span>
              <span className="text-neutral-300 truncate max-w-[120px]">
                {account.description}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400">+2.5%</span>
              </div>
              <DialogUpdateAccountBank
                accountBankId={account.id}
                defaultValues={{
                  amount: transformToCurrency(account.amount),
                  bank: account.bank,
                  description: account.description,
                }}
              />
              
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

AccountBank.displayName = "AccountBank";
