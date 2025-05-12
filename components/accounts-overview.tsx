"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet } from "lucide-react"
import { useAuth } from "@/lib/use-auth"

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

export function AccountsOverview() {
	const [accounts, setAccounts] = useState<Account[]>([])
	const [totalBalance, setTotalBalance] = useState(0)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const { solData } = useAuth()

	useEffect(() => {
		const fetchBalances = async () => {
			try {
				// const ownerAddress = "DUMMY_ADDRESS" // Replace with actual address
				const ownerAddress = solData.address
				const response = await axios.get<ApiResponse>(
					`https://api.vybenetwork.xyz/account/token-balance/${ownerAddress}`,
					{
						headers: {
							"x-api-key": process.env.VYBE_API_KEY
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

				setAccounts(transformedAccounts)
				setTotalBalance(parseFloat(response.data.totalTokenValueUsd))
			} catch (err) {
				console.error(err)
				setError("Failed to fetch account balances")
			} finally {
				setLoading(false)
			}
		}

		fetchBalances()
	}, [])

	if (loading) {
		return <div>Loading balances...</div>
	}

	if (error) {
		return <Card>

			<CardHeader>Accounts Overview</CardHeader>
			<CardContent className="text-muted-foreground">{error}</CardContent>
		</Card>
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">Accounts Overview</CardTitle>
				<Wallet className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">${totalBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
				<p className="text-xs text-muted-foreground">Total balance across all accounts</p>
				<div className="mt-4 space-y-2">
					{accounts.map((account) => (
						<div key={account.name} className="flex justify-between items-center">
							<span className="text-sm text-muted-foreground">{account.name}</span>
							<span className="text-sm font-medium">
								${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</span>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
