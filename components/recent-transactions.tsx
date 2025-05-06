"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
} from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { getUserTransactions } from "@/lib/auth-functions";
import { truncateAddress } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

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

export function RecentTransactions() {
  const { getAccessToken, authenticated } = usePrivy();
  const [viewAll, setViewAll] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // Fetch access token once when authenticated
  const fetchAccessToken = async (): Promise<string | null> => {
    if (!authenticated) return null;
    try {
      return await getAccessToken();
    } catch (error) {
      console.error("Error getting access token:", error);
      throw new Error("Failed to get access token");
    }
  };

  // Use TanStack Query for token fetching
  const tokenQuery = useQuery({
    queryKey: ['accessToken'],
    queryFn: fetchAccessToken,
    enabled: authenticated,
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
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
    retry: 3
  });

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
        {transactionsQuery.isLoading && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Loading transactions...
          </div>
        )}
        
        {/* Error state */}
        {transactionsQuery.isError && (
          <div className="py-6 text-center text-sm text-red-500">
            {transactionsQuery.error instanceof Error 
              ? transactionsQuery.error.message 
              : "Failed to load transactions"}
          </div>
        )}
        
        {/* Empty state */}
        {transactionsQuery.isSuccess && displayTransactions.length === 0 && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No transactions found
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