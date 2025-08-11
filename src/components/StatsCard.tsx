import { ArrowDownRight, ArrowUpRight, LucideIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "up" | "down";
  icon: LucideIcon;
  color: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
}: StatsCardProps) {
  return (
    <Card className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border-neutral-700/50 hover:border-neutral-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-neutral-900/20 hover:scale-105">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded ${color}`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-neutral-400 font-medium">
                {title}
              </span>
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            {change && (
              <div className="flex items-center gap-1">
                {changeType === "up" ? (
                  <ArrowUpRight className="w-4 h-4 text-green-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                )}
                <span
                  className={`text-sm font-medium ${
                    changeType === "up" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {change}
                </span>
                <span className="text-xs text-neutral-500">
                  vs mês anterior
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
