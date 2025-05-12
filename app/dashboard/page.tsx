"use client";
import { AccountsOverview } from "@/components/accounts-overview";
import { RecentTransactions } from "@/components/recent-transactions";
import { ApiKeyManagement } from "@/components/api-key-management";
import { Toaster } from "sonner";

export default function Dashboard() {

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <ApiKeyManagement />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <AccountsOverview />
        </div>
        <div className="lg:col-span-1">
          <RecentTransactions />
        </div>
      </div>
	  <Toaster />
    </div>
  );
}
