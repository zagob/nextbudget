import { BarChart3, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { StatsCard } from "../StatsCard";

export function DynamicStatsCards() {
  return (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Saldo Total"
          value="R$ 0,00"
          change="--"
          icon={DollarSign}
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatsCard
          title="Receitas (Mês)"
          value="R$ 0,00"
          change="--"
          icon={TrendingUp}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatsCard
          title="Despesas (Mês)"
          value="R$ 0,00"
          change="--"
          icon={TrendingDown}
          color="bg-gradient-to-br from-red-500 to-red-600"
        />
        <StatsCard
          title="Balanço do Mês"
          value="R$ 0,00"
          change="--"
          icon={DollarSign}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        
        {/* <StatsCard
          title="Categorias"
          value="0"
          change="--"
          icon={BarChart3}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        /> */}
      </div>
  );
}
