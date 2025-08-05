"use client";

import { useState, } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { useQuery } from "@tanstack/react-query";

import { transformToCurrency } from "@/lib/utils";
import {
  CreditCard,
} from "lucide-react";
import { LoadingCard } from "../LoadingCard";
import { useSession } from "next-auth/react";
import { getBanks } from "@/actions/banks/getBanks.actions";
import { AccountBank } from "./AccountBank";
import { DialogAccountBank } from "../DialogAccountBank";



export const AccountBanks = () => {
  const [visibleAccounts, setVisibleAccounts] = useState<
    Record<string, boolean>
  >({});

  const { data: session, status } = useSession();

  const { data: banks, isPending } = useQuery({
    queryKey: ["account-banks"],
    queryFn: async () => await getBanks(),
  });

  const isLoading = status === "loading";

  const userId = session?.user.id;

  const toggleAccountVisibility = (accountId: string) => {
    setVisibleAccounts((prev) => ({
      ...prev,
      [accountId]: !prev[accountId],
    }));
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border-neutral-700/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-white">
            <CreditCard className="w-5 h-5" />
            Contas Bancárias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingCard />
        </CardContent>
      </Card>
    );
  }

  if (!isLoading && !userId) {
    return (
      <Card className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border-neutral-700/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-white">
            <CreditCard className="w-5 h-5" />
            Contas Bancárias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-400 mb-2">
              Faça login para ver suas contas
            </p>
            <p className="text-xs text-neutral-500">Autenticação necessária</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isPending) {
    return (
      <Card className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border-neutral-700/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-white">
            <CreditCard className="w-5 h-5" />
            Contas Bancárias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingCard />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border-neutral-700/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <CreditCard className="w-5 h-5" />
            Contas Bancárias
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-neutral-800 rounded-md">
              <span className="text-sm text-neutral-300">
                Total: {transformToCurrency(banks?.data?.totalAmount ?? 0)}
              </span>
            </div>
            <DialogAccountBank />
            
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {banks?.data?.totalBanks === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-400 mb-2">Nenhuma conta cadastrada</p>
            <p className="text-xs text-neutral-500">
              Adicione sua primeira conta bancária
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {banks?.data?.banks.map((account) => (
              <AccountBank
                key={account.id}
                account={account}
                isVisible={visibleAccounts[account.id] || false}
                onToggleVisibility={() => toggleAccountVisibility(account.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
