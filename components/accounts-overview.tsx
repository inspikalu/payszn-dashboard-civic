"use client"

import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet } from "lucide-react"
import { useAuth } from "@/lib/use-auth"
import { useQuery } from "@tanstack/react-query"

interface Account {
  name: string;
  balance: number;
}

interface ApiResponse {
  activeStakedSolBalanceUsd: string;
  stakedSolBalanceUsd: string;
  data: {
    name: string;
    valueUsd: string;
  }[];
  totalTokenValueUsd: string;
}

async function fetchAccountsOverview(ownerAddress: string): Promise<{ accounts: Account[], totalBalance: number }> {
  const response = await axios.get<ApiResponse>(
    `https://api.vybenetwork.xyz/account/token-balance/${ownerAddress}`,
    {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_VYBE_API_KEY
      }
    }
  )

  const transformedAccounts: Account[] = [
    {
      name: "Active Staked SOL",
      balance: parseFloat(response.data.activeStakedSolBalanceUsd)
    },
    {
      name: "Staked SOL",
      balance: parseFloat(response.data.stakedSolBalanceUsd)
    },
    ...response.data.data.map(token => ({
      name: token.name,
      balance: parseFloat(token.valueUsd)
    }))
  ]

  return {
    accounts: transformedAccounts,
    totalBalance: parseFloat(response.data.totalTokenValueUsd)
  }
}

export function AccountsOverview() {
  const { solData } = useAuth()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['accountsOverview', solData.address],
    queryFn: () => fetchAccountsOverview(solData.address),
    enabled: !!solData.address,
    staleTime: 5 * 60 * 1000 // 5 minutes cache
  })

  if (isLoading) {
    return <div>Loading balances...</div>
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>Accounts Overview</CardHeader>
        <CardContent className="text-muted-foreground">
          {error.message || "Failed to fetch account balances"}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Accounts Overview</CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
	  {data &&  <CardContent>
        <div className="text-2xl font-bold">${data.totalBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
        <p className="text-xs text-muted-foreground">Total balance across all accounts</p>
        <div className="mt-4 space-y-2">
          {data.accounts.map((account) => (
            <div key={account.name} className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{account.name}</span>
              <span className="text-sm font-medium">
                ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
}
         </Card>
  )
}
