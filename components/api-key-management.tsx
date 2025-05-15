"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key, Copy, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserInfo, createApiKey } from "@/lib/auth-functions";
import { toast } from "sonner";
import { useUser } from "@civic/auth-web3/react";
import { getAccessToken } from "@/lib/get-civic-user";
import { useAuth } from "@/lib/use-auth";
import { Connection, PublicKey } from "@solana/web3.js";
import {
        getAssociatedTokenAddress,
        getAccount,
        TokenAccountNotFoundError,
        TokenInvalidAccountOwnerError,
} from "@solana/spl-token";

// USDC mint address for mainnet
const USDC_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

// Types
interface UserInfo {
        apiKey: string | null;
        [key: string]: unknown;
}

interface ATAStatus {
        status: "valid" | "missing";
}

interface SolData {
        address: string;
}

interface AuthState {
        isLoading: boolean;
        isAuthenticated: boolean;
        user: unknown | null;
        solData: SolData | null;
}


// Type external functions (assumed signatures)
type GetUserInfoFn = (token: string) => Promise<UserInfo>;
type CreateApiKeyFn = (token: string) => Promise<UserInfo>;
type GetAccessTokenFn = () => Promise<string | null>;

// Function to validate USDC ATA
const validateUSDCATA = async (solanaAddress: string): Promise<ATAStatus> => {
        try {
                const connection = new Connection(
                        process.env.NEXT_PUBLIC_HELIUS_URL || "https://api.mainnet-beta.solana.com",
                        "confirmed"
                );
                const ata = await getAssociatedTokenAddress(
                        new PublicKey(USDC_MINT_ADDRESS),
                        new PublicKey(solanaAddress)
                );
                await getAccount(connection, ata);
                return { status: "valid" };
        } catch (error: unknown) {
                if (
                        error instanceof TokenAccountNotFoundError ||
                        error instanceof TokenInvalidAccountOwnerError
                ) {
                        return { status: "missing" };
                }
                console.error("Error validating USDC ATA:", error);
                throw new Error("Failed to validate USDC ATA");
        }
};

export function ApiKeyManagement() {
        const civicUser = useUser();
        const queryClient = useQueryClient();
        const [isGenerating, setIsGenerating] = useState<boolean>(false);
        const { solData } = useAuth() as AuthState;

        // Query to fetch user info including API key
        const { data: userInfo, isLoading: isUserInfoLoading } = useQuery<
                UserInfo | null,
                Error
        >({
                queryKey: ["userInfo"],
                queryFn: async () => {
                        if (!civicUser.user) return null;
                        const token = await (getAccessToken as GetAccessTokenFn)();
                        if (!token) throw new Error("Token Not found");
                        return (getUserInfo as GetUserInfoFn)(token);
                },
                enabled: !!civicUser.user,
        });

        // Query to validate USDC ATA
        const { data: ataStatus, isLoading: isAtaLoading, error: ataError } = useQuery<
                ATAStatus,
                Error
        >({
                queryKey: ["usdcATA", solData?.address],
                queryFn: async () => {
                        if (!solData?.address) throw new Error("Solana address not found");
                        return validateUSDCATA(solData.address);
                },
                enabled: !!solData?.address,
        });

        // Handle ATA status changes
        useEffect(() => {
                if (ataStatus) {
                        if (ataStatus.status === "missing") {
                                toast("Wallet Setup Required")
                        } else if (ataStatus.status === "valid") {
                                toast("Wallet Ready");
                        }
                }
                if (ataError) {
                        toast("Error: Failed to check wallet setup. Please try again.",
                        );
                        console.error("ATA validation error:", ataError);
                }
        }, [ataStatus, ataError, toast]);

        // Mutation to create a new API key
        const generateApiKeyMutation = useMutation<UserInfo, Error>({
                mutationFn: async () => {
                        const token = await (getAccessToken as GetAccessTokenFn)();
                        if (!token) throw new Error("Token Not found");
                        return (createApiKey as CreateApiKeyFn)(token);
                },
                onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ["userInfo"] });
                        setIsGenerating(false);
                        toast("API Key Generated");
                },
                onError: (error) => {
                        setIsGenerating(false);
                        toast("Error: Failed to generate API key. Please try again.");
                        console.error("Error generating API key:", error);
                },
        });

        const handleGenerateApiKey = () => {
                setIsGenerating(true);
                generateApiKeyMutation.mutate();
        };

        const copyToClipboard = () => {
                if (userInfo?.apiKey) {
                        navigator.clipboard.writeText(userInfo.apiKey);
                        toast("API key copied to clipboard");
                }
        };

        return (
                <>
                        <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                                API Key & Wallet Setup
                                        </CardTitle>
                                        <Key className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                        {isUserInfoLoading || isAtaLoading ? (
                                                <div className="h-16 flex items-center justify-center">
                                                        <p className="text-sm text-muted-foreground">Loading...</p>
                                                </div>
                                        ) : userInfo?.apiKey ? (
                                                <div className="space-y-4">
                                                        <div>
                                                                <div className="text-xs text-muted-foreground mb-1">
                                                                        Your API Key
                                                                </div>
                                                                <div className="relative">
                                                                        <div className="bg-muted p-2 rounded text-sm font-mono truncate pr-10">
                                                                                {userInfo.apiKey}
                                                                        </div>
                                                                        <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="absolute right-1 top-1"
                                                                                onClick={copyToClipboard}
                                                                        >
                                                                                <Copy className="h-4 w-4" />
                                                                        </Button>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground mt-2">
                                                                        Keep this key secure. It provides access to your account.
                                                                </p>
                                                        </div>
                                                        {ataStatus?.status === "missing" && (
                                                                <div className="p-3 border rounded text-sm">
                                                                        <p>Your wallet is not set up to receive USDC.</p>
                                                                        <p className="mt-1">
                                                                                Please deposit USDC to your wallet to enable payments.
                                                                        </p>
                                                                </div>
                                                        )}
                                                        <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="w-full"
                                                                onClick={handleGenerateApiKey}
                                                                disabled={isGenerating}
                                                        >
                                                                <RefreshCw
                                                                        className={`mr-2 h-4 w-4 ${isGenerating ? "animate-spin" : ""}`}
                                                                />
                                                                Regenerate Key
                                                        </Button>
                                                </div>
                                        ) : (
                                                <div className="space-y-4">
                                                        <div className="h-16 flex flex-col items-center justify-center">
                                                                <p className="text-sm text-muted-foreground mb-2">
                                                                        You don't have an API key yet
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                        Generate a key to integrate with our services
                                                                </p>
                                                        </div>
                                                        {ataStatus?.status === "missing" && (
                                                                <div className="p-3  border rounded text-sm">
                                                                        <p>Your wallet is not set up to receive USDC.</p>
                                                                        <p className="mt-1">
                                                                                Please deposit USDC to your wallet to enable payments.
                                                                        </p>
                                                                </div>
                                                        )}
                                                        <Button
                                                                size="sm"
                                                                className="w-full"
                                                                onClick={handleGenerateApiKey}
                                                                disabled={isGenerating}
                                                        >
                                                                <Key className={`mr-2 h-4 w-4 ${isGenerating ? "hidden" : ""}`} />
                                                                {isGenerating ? (
                                                                        <>
                                                                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                                                                Generating...
                                                                        </>
                                                                ) : (
                                                                        "Generate API Key"
                                                                )}
                                                        </Button>
                                                </div>
                                        )}
                                </CardContent>
                        </Card>
                </>
        );
}
