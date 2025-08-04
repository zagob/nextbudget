"use client";

import { memo, useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Shield, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { Skeleton } from "../ui/skeleton";

export const DashboardHeader = memo(() => {
  const { data: session, status } = useSession();
  const [currentYear, setCurrentYear] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  const user = session?.user;

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    setCurrentYear(format(new Date(), "yyyy"));

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border-neutral-700/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              Dashboard Financeiro
            </h1>
            <p className="text-neutral-400">
              {isAuthenticated
                ? `Bem-vindo, ${user?.name || "Usuário"}!`
                : "Bem-vindo ao seu controle financeiro pessoal"}
            </p>
          </div>

          <div className="text-right space-y-1">
            <div className="text-2xl font-bold text-white">{currentTime}</div>
            <div className="text-sm text-neutral-400">{currentYear}</div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400">Sistema Online</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400">Dados em Tempo Real</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/30">
            <Shield className="w-4 h-4 text-purple-400" />
            {isLoading ? (
              <Skeleton className="w-20 h-3 bg-purple-400 rounded-full" />
            ) : (
              <span className="text-sm text-purple-400">
                {isAuthenticated ? "Autenticado" : "Não Autenticado"}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

DashboardHeader.displayName = "DashboardHeader";
