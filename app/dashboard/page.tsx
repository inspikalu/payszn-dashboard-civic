"use client";
import { AccountsOverview } from "@/components/accounts-overview";
import { RecentTransactions } from "@/components/recent-transactions";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { ApiKeyManagement } from "@/components/api-key-management";

export default function Dashboard() {
  const { getAccessToken, authenticated } = usePrivy();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      if (authenticated) {
        try {
          const token = await getAccessToken();
          setAccessToken(token);
          console.log("Access token:", token);
          // Now you can use this token for API calls
        } catch (error) {
          console.error("Error fetching access token:", error);
        }
      }
    };

    fetchAccessToken();
  }, [authenticated, getAccessToken]);

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
    </div>
  );
}
