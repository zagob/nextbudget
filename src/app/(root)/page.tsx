import { AccountBanks } from "@/components/Dashboard/AccountBanks";
import { Categories } from "@/components/Dashboard/Categories";
import { DateStats } from "@/components/Dashboard/DateStats";
import { DynamicStatsCards } from "@/components/Dashboard/DynamicStatsCards";
import { FilterDate } from "@/components/Dashboard/FilterDate";
import { DashboardHeader } from "@/components/Dashboard/Header";
import { HistoricStatsCard } from "@/components/Dashboard/HistoricStatsCard";
import { LatestTransactions } from "@/components/Dashboard/LatestTransactions";
import { DateNavigation } from "@/components/DateNavigation";
import { LoadingCard } from "@/components/LoadingCard";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="p-6 space-y-6">
      <DashboardHeader />

      <DynamicStatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          <DateNavigation />
          <DateStats />

           <Suspense fallback={<LoadingCard />}>
            <AccountBanks />
          </Suspense>

          <Suspense fallback={<LoadingCard />}>
            <LatestTransactions />
          </Suspense>
        </div>

        <div className="space-y-6">
           <Suspense fallback={<LoadingCard />}>
            <HistoricStatsCard transactions={[]} />
          </Suspense>

          <Suspense fallback={<LoadingCard />}>
            <Categories />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
