"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { getUserTransactions } from "@/lib/auth-functions";
import { truncateAddress } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@civic/auth-web3/react";
import { getAccessToken } from "@/lib/get-civic-user";

// Define proper TypeScript interfaces
interface Transaction {
  id: string;
  signature: string;
  sender: string;
  receiver: string;
  amount: string;
  confirmed: boolean;
}

interface FormattedTransaction {
  id: string;
  signature: string;
  sender: string;
  receiver: string;
  amount: number;
  confirmed: boolean;
  date: string;
}

const is404Error = (error: unknown) => {
  return (error as { status?: number })?.status === 404;
};

export function RecentTransactions() {
  const civicUser = useUser()
  const [viewAll, setViewAll] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // Fetch access token once when authenticated
  const fetchAccessToken = async (): Promise<string | null> => {
    if (!civicUser.user) return null;
    try {
      const token = await getAccessToken();
      return token as unknown as string | null
    } catch (error) {
      console.error("Error getting access token:", error);
      throw new Error("Failed to get access token");
    }
  };

  // Use TanStack Query for token fetching
  const tokenQuery = useQuery({
    queryKey: ['accessToken'],
    queryFn: fetchAccessToken,
    enabled: !civicUser.user ? false : true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2
  });

  // Use the token to fetch transactions with TanStack Query
  const transactionsQuery = useQuery({
    queryKey: ['transactions', tokenQuery.data],
    queryFn: async () => {
      if (!tokenQuery.data) throw new Error("Token not found");
      return await getUserTransactions(tokenQuery.data) as Transaction[];
    },
    enabled: !!tokenQuery.data,
	staleTime: 1000 * 60 * 5, // Increase to 5 minutes
    gcTime: 1000 * 60 * 30, // Keep cache for 30 minutes
    refetchOnWindowFocus: false, // Disable or make conditional
    refetchInterval: 1000 * 60 * 10, // Optional: Poll every 10 mins
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)  });

  // Format transaction data
  const formatTransactions = (txList: Transaction[] = []): FormattedTransaction[] => {
    return txList.map((tx) => ({
      id: tx.id,
      signature: tx.signature,
      sender: tx.sender,
      receiver: tx.receiver,
      amount: parseFloat(tx.amount),
      confirmed: tx.confirmed,
      date: new Date().toISOString().split("T")[0], // Using current date as placeholder
    }));
  };

  const displayTransactions = formatTransactions(transactionsQuery.data || []);
  const transactionsToShow = viewAll
    ? displayTransactions
    : displayTransactions.slice(0, 3);

  // Copy address to clipboard
  const copyToClipboard = (text: string, type: "sender" | "receiver"): void => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAddress(`${type}-${text}`);
      setTimeout(() => {
        setCopiedAddress(null);
      }, 2000);
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          Recent Transactions
        </CardTitle>
        {displayTransactions.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => setViewAll(!viewAll)}
          >
            {viewAll ? "Show Less" : "View All"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {/* Loading state */}
{transactionsQuery.isLoading || transactionsQuery.isRefetching ? (
  <div className="py-6 text-center text-sm text-muted-foreground">
    {transactionsQuery.isRefetching ? 'Refreshing...' : 'Loading transactions...'}
  </div>
) : null}        
        {/* Error state */}
{transactionsQuery.isError && (
  <div className="py-6 text-center">
    {is404Error(transactionsQuery.error) ? (
      <div className="flex flex-col items-center gap-3">
        <div className="text-muted-foreground">
          No transactions found yet
        </div>
        <Button 
          variant="outline"
          size="sm"
          onClick={() => transactionsQuery.refetch()}
        >
          Check Again
        </Button>
      </div>
    ) : (
      <div className="flex flex-col items-center gap-3">
        <div className="text-red-500">
          Failed to load transactions
        </div>
        <Button 
          variant="outline"
          size="sm"
          onClick={() => transactionsQuery.refetch()}
        >
          Retry
        </Button>
      </div>
    )}
  </div>
)}        
        {/* Empty state */}
{transactionsQuery.isSuccess && displayTransactions.length === 0 && (
  <div className="py-6 text-center">
    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
      <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
    </div>
    <h4 className="text-sm font-medium">No transactions yet</h4>
    <p className="text-sm text-muted-foreground mt-1">
      Your transaction history will appear here
    </p>
  </div>
)}        
        {/* Success state with transactions */}
        {transactionsQuery.isSuccess && displayTransactions.length > 0 && (
          <div className="space-y-4">
            {transactionsToShow.map((transaction) => (
              <div
                key={transaction.id}
                className="rounded-lg border p-3 hover:bg-muted/50 transition-colors"
              >
                {/* Transaction header - made fully responsive */}
                <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center">
                    <div className="mr-3">
                      {transaction.confirmed ? (
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                          <ArrowUpRight className="h-4 w-4 text-yellow-600" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        <a
                          href={`https://solscan.io/tx/${transaction.signature}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center hover:text-blue-600"
                        >
                          Transaction
                          <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                        </a>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      +{transaction.amount.toFixed(6)} USDC
                    </span>
                  </div>
                </div>

                {/* Transaction details - improved responsive grid */}
                <div className="grid grid-cols-1 gap-2 mt-3">
                  <div className="flex items-center p-2 rounded-md bg-muted/50">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">From</p>
                      <p className="text-sm truncate">
                        {truncateAddress(transaction.sender)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0 ml-1"
                      onClick={() =>
                        copyToClipboard(transaction.sender, "sender")
                      }
                    >
                      {copiedAddress === `sender-${transaction.sender}` ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center p-2 rounded-md bg-muted/50">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">To</p>
                      <p className="text-sm truncate">
                        {truncateAddress(transaction.receiver)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0 ml-1"
                      onClick={() =>
                        copyToClipboard(transaction.receiver, "receiver")
                      }
                    >
                      {copiedAddress === `receiver-${transaction.receiver}` ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View all button */}
        {!viewAll && displayTransactions.length > 3 && (
          <Button
            className="w-full mt-4"
            variant="outline"
            onClick={() => setViewAll(true)}
          >
            View All Transactions
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
