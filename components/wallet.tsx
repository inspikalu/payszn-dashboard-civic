"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
	Wallet,
	X,
	Send,
	Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Connection,
	PublicKey,
	LAMPORTS_PER_SOL,
	SystemProgram,
	Transaction,
} from "@solana/web3.js";
import {
	TOKEN_PROGRAM_ID,
	createTransferInstruction,
	getAssociatedTokenAddress,
	createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import {
	SolanaEmbeddedWallet,
} from "@/lib/wallet-utils";

import { useAuth } from "@/lib/use-auth";
import { toast } from "sonner";

interface ITransaction {
	signature: string;
	type: string;
	amount: string;
	date: string;
	counterparty: string;
	tokenType?: string;
}

interface WalletState {
	balance: number;
	usdcBalance: number;
	transactions: ITransaction[];
	usdcTokenAccount: string;
	lastFetched: number | null;
}

// USDC Token address on Solana
const USDC_MINT_ADDRESS = new PublicKey(
	"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
); // Mainnet
// Cache expiration time (5 minutes in milliseconds)
const CACHE_EXPIRATION = 5 * 60 * 1000;
// Minimum time between refetches (30 seconds)
const REFETCH_THROTTLE = 30 * 1000;

export function WalletDropdown(): JSX.Element {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [activeTab, setActiveTab] = useState<string>("balance");
	const [recipientAddress, setRecipientAddress] = useState<string>("");
	const [transferAmount, setTransferAmount] = useState<string>("");
	const [selectedToken, setSelectedToken] = useState<string>("SOL");
	const [loading, setLoading] = useState<boolean>(false);
	const [walletAddress, setWalletAddress] = useState<string>("");
	const [hasWallet, setHasWallet] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [solanaWallet, setSolanaWallet] = useState<
		SolanaEmbeddedWallet | undefined
	>(undefined);

	// Create a ref to hold wallet state
	const walletStateRef = useRef<WalletState>({
		balance: 0,
		usdcBalance: 0,
		transactions: [],
		usdcTokenAccount: "",
		lastFetched: null,
	});

	// Expose the current state for component rendering
	const [walletState, setWalletState] = useState<WalletState>({
		balance: 0,
		usdcBalance: 0,
		transactions: [],
		usdcTokenAccount: "",
		lastFetched: null,
	});

	const { isAuthenticated, solData } = useAuth()


	// Create a connection ref to avoid recreating on each render
	const connectionRef = useRef<Connection | null>(null);

	// Flag to track initial loading
	const isLoadingRef = useRef<boolean>(false);

	// Initialize connection once
	useEffect(() => {
		connectionRef.current = new Connection(
			process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
			"https://api.mainnet-beta.solana.com",
			"confirmed"
		);
	}, []);

	// Update state utility function that updates both the ref and state
	const updateWalletState = useCallback((updates: Partial<WalletState>) => {
		walletStateRef.current = {
			...walletStateRef.current,
			...updates,
			lastFetched: Date.now(),
		};
		setWalletState(walletStateRef.current);
	}, []);

	// Memoized function to check if cache is valid
	const isCacheValid = useCallback(() => {
		const lastFetched = walletStateRef.current.lastFetched;
		if (!lastFetched) return false;
		return Date.now() - lastFetched < CACHE_EXPIRATION;
	}, []);

	// Fetch all wallet data in a single function to minimize separate calls
	const fetchWalletData = useCallback(
		async (address: string, forceRefresh = false) => {
			if (!connectionRef.current || !address) return;

			// Skip if already loading or if cache is valid and not forcing refresh
			if (isLoadingRef.current || (isCacheValid() && !forceRefresh)) {
				return;
			}

			// Check if we should throttle the refetch
			if (walletStateRef.current.lastFetched && !forceRefresh) {
				const timeSinceLastFetch =
					Date.now() - walletStateRef.current.lastFetched;
				if (timeSinceLastFetch < REFETCH_THROTTLE) {
					return;
				}
			}

			isLoadingRef.current = true;

			try {
				const publicKey = new PublicKey(address);
				// const publicKey = new PublicKey("CAPhoEse9xEH95XmdnJjYrZdNCA8xfUWdy3aWymHa1Vj")
				console.log("Address on line 163: ", publicKey)

				// Create a batch of promises for parallel execution
				const [lamports, tokenAccounts, signatures] = await Promise.all([
					connectionRef.current.getBalance(publicKey),
					connectionRef.current.getParsedTokenAccountsByOwner(publicKey, {
						programId: TOKEN_PROGRAM_ID,
					}),
					connectionRef.current.getSignaturesForAddress(publicKey, {
						limit: 5,
					}),
				]);
				console.log("Wallet data fetching data tokenAccounts: ", tokenAccounts)
				console.log("Wallet data fetching data lamports", lamports)
				console.log("Wallet data fetching data signatures: ", signatures)

				// Process SOL balance
				const solBalance = lamports / LAMPORTS_PER_SOL;

				// Process USDC balance
				let usdcBalance = 0;
				let usdcTokenAccount = "";

				const usdcAccount = tokenAccounts.value.find(
					(account) =>
						account.account.data.parsed.info.mint ===
						USDC_MINT_ADDRESS.toString()
				);

				if (usdcAccount) {
					usdcBalance =
						usdcAccount.account.data.parsed.info.tokenAmount.uiAmount;
					usdcTokenAccount = usdcAccount.pubkey.toString();
				}

				// Process transaction history
				// For real transactions (if you have the data):
				let txHistory: ITransaction[] = [];

				try {
					txHistory = signatures.map((sig) => {
						if (!sig.blockTime) throw new Error("Block time not found");
						const isUsdc = Math.random() > 0.7; // Just for demo purposes
						return {
							signature: sig.signature,
							type: Math.random() > 0.5 ? "Received" : "Sent",
							amount: isUsdc
								? (Math.random() * 10).toFixed(2) + " USDC"
								: (Math.random() * 0.5).toFixed(4) + " SOL",
							date: new Date(sig.blockTime * 1000).toLocaleString(),
							counterparty: generateRandomAddress(),
							tokenType: isUsdc ? "USDC" : "SOL",
						};
					});
				} catch (error) {
					console.warn("Using fallback transactions due to error:", error);
				}

				// Update all state at once to avoid multiple renders
				updateWalletState({
					balance: solBalance,
					usdcBalance,
					usdcTokenAccount,
					transactions: txHistory,
				});
			} catch (error) {
				console.error("Error fetching wallet data:", error);
				setErrorMessage("Failed to fetch wallet data");
			} finally {
				isLoadingRef.current = false;
			}
		},
		[isCacheValid, updateWalletState]
	);

	// Initialize wallet only when both authenticated and wallet dropdown is opened
	useEffect(() => {
		const initWallet = async (): Promise<void> => {
			if (isAuthenticated && isOpen) {
				try {
					const wallet = solData.wallet;

					if (wallet) {
						setSolanaWallet(wallet);
						setWalletAddress(solData.address);

						// Only fetch data if cache is invalid or if we've never fetched before
						if (!isCacheValid()) {
							fetchWalletData(wallet.address);
						}
					} else {
						setHasWallet(false);
					}
				} catch (error) {
					console.error("Error initializing wallet:", error);
					setErrorMessage("Failed to initialize wallet");
				}
			}
		};

		initWallet();
	}, [isAuthenticated, solData, isOpen, fetchWalletData, isCacheValid]);

	// Handle transfer with optimized token account checks
	const handleTransfer = async (): Promise<void> => {
		if (
			!recipientAddress ||
			!transferAmount ||
			!solanaWallet ||
			!connectionRef.current
		)
			return;

		try {
			setLoading(true);
			setErrorMessage("");

			// Validate recipient address
			const toPubkey = new PublicKey(recipientAddress);
			const fromPubkey = new PublicKey(solanaWallet.address);
			let transaction = new Transaction();

			if (selectedToken === "SOL") {
				// Handle SOL transfer
				const amount = parseFloat(transferAmount);
				const lamportsToSend = Math.floor(amount * LAMPORTS_PER_SOL);

				transaction.add(
					SystemProgram.transfer({
						fromPubkey,
						toPubkey,
						lamports: lamportsToSend,
					})
				);
			} else if (selectedToken === "USDC") {
				// Handle USDC transfer
				const amount = parseFloat(transferAmount);
				const tokenAmount = Math.floor(amount * 10 ** 6); // USDC has 6 decimals

				if (!walletState.usdcTokenAccount) {
					throw new Error("You don't have a USDC token account");
				}

				// Get sender's token account
				const senderTokenAccount = new PublicKey(walletState.usdcTokenAccount);

				// Get or create recipient's associated token account
				const recipientTokenAccount = await getAssociatedTokenAddress(
					USDC_MINT_ADDRESS,
					toPubkey
				);

				// Check if recipient's token account exists
				const recipientTokenAccountInfo =
					await connectionRef.current.getAccountInfo(recipientTokenAccount);

				// If it doesn't exist, create it first
				if (!recipientTokenAccountInfo) {
					transaction.add(
						createAssociatedTokenAccountInstruction(
							fromPubkey, // payer
							recipientTokenAccount, // associated token account address
							toPubkey, // owner
							USDC_MINT_ADDRESS // mint
						)
					);
				}

				// Add transfer instruction
				transaction.add(
					createTransferInstruction(
						senderTokenAccount, // source
						recipientTokenAccount, // destination
						fromPubkey, // owner
						tokenAmount // amount
					)
				);
			}

			// Get recent blockhash
			const { blockhash } = await connectionRef.current.getLatestBlockhash();
			transaction.recentBlockhash = blockhash;
			transaction.feePayer = fromPubkey;

			// Sign and send transaction using the embedded wallet
			const signature = await solanaWallet.signAndSendTransaction(transaction);
			console.log("Transaction sent:", signature);

			// Update the UI with new transaction and force a data refresh
			const truncatedRecipient = `${recipientAddress.substring(
				0,
				4
			)}...${recipientAddress.substring(recipientAddress.length - 4)}`;

			// Add new transaction to the list immediately without waiting for refresh
			const newTransaction = {
				signature,
				type: "Sent",
				amount: `${transferAmount} ${selectedToken}`,
				date: new Date().toLocaleString(),
				counterparty: truncatedRecipient,
				tokenType: selectedToken,
			};

			// Update the state with the new transaction first
			updateWalletState({
				transactions: [newTransaction, ...walletState.transactions],
			});

			// Force refresh wallet data to get updated balances
			// Use a timeout to allow the transaction to be confirmed
			setTimeout(() => {
				fetchWalletData(solanaWallet.address, true);
			}, 3000);

			// Reset form
			setRecipientAddress("");
			setTransferAmount("");
		} catch (error: any) {
			console.error("Error transferring funds:", error);
			setErrorMessage(error.message || "Failed to transfer funds");
		} finally {
			setLoading(false);
		}
	};

	const generateRandomAddress = (): string => {
		const addr = Array(32)
			.fill(0)
			.map(() => Math.random().toString(36).charAt(2))
			.join("");
		return addr.substring(0, 4) + "..." + addr.substring(addr.length - 4);
	};

	const formatAddress = (address: string): string => {
		if (!address) return "";
		return `${address.substring(0, 6)}...${address.substring(
			address.length - 4
		)}`;
	};

	const handleReceive = (): void => {
		// Copy the wallet address to clipboard
		if (walletAddress) {
			navigator.clipboard
				.writeText(walletAddress)
				.then(() => {
						toast("Address copied to clipboard")
					console.log("Address copied to clipboard");
				})
				.catch((err) => {
					console.error("Failed to copy address:", err);
				});
		}
	};

	// Manual refresh function for user-triggered refreshes
	const handleManualRefresh = () => {
		if (walletAddress) {
			fetchWalletData(walletAddress, true);
		}
	};

	return (
		<div className="relative">
			<Button
				variant="ghost"
				size="icon"
				className="relative"
				onClick={() => setIsOpen(!isOpen)}
				aria-label="Wallet"
			>
				<Wallet className="h-5 w-5" />
				{hasWallet && (
					<span className="absolute top-0 right-0 h-2 w-2 bg-green-500 rounded-full" />
				)}
			</Button>

			{isOpen && (
				<Card className="absolute right-0 mt-2 w-96 z-50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Solana Wallet</CardTitle>
						<div className="flex items-center space-x-1">
							<Button
								variant="ghost"
								size="icon"
								onClick={handleManualRefresh}
								aria-label="Refresh"
								className="h-6 w-6"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
									<path d="M21 3v5h-5" />
									<path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
									<path d="M3 21v-5h5" />
								</svg>
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setIsOpen(false)}
								aria-label="Close wallet"
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					</CardHeader>

					<CardContent>
						{!isAuthenticated ? (
							<div className="flex flex-col items-center justify-center p-4 text-center">
								<p className="mb-4">Please sign in to access your wallet</p>
							</div>
						) : !hasWallet ? (
							<div className="flex flex-col items-center justify-center p-4 text-center">
								<p className="mb-4">Solana wallet not found</p>
								<p className="text-sm text-muted-foreground">
									Your wallet should be automatically created upon login. Please
									try refreshing the page or signing out and back in.
								</p>
							</div>
						) : (
							<>
								<div className="mb-4 p-4 bg-muted rounded-lg">
									<div className="flex justify-between items-center mb-2">
										<span className="text-sm font-medium">SOL Balance</span>
										<span className="text-xl font-bold">
											{walletState.balance.toFixed(5)} SOL
										</span>
									</div>
									<div className="flex justify-between items-center mb-2">
										<span className="text-sm font-medium">USDC Balance</span>
										<span className="text-xl font-bold">
											{walletState.usdcBalance.toFixed(2)} USDC
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-sm text-muted-foreground">
											Address
										</span>
										<div className="flex items-center space-x-1">
											<span className="text-sm">
												{formatAddress(walletAddress)}
											</span>
											<Button
												variant="ghost"
												size="icon"
												className="h-5 w-5"
												onClick={() => {
													if (walletAddress) {
														navigator.clipboard
															.writeText(walletAddress)
															.then(() => {
																console.log("Address copied to clipboard");
															})
															.catch((err) => {
																console.error("Failed to copy address:", err);
															});
													}
												}}
												title="Copy address to clipboard"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
													className="text-muted-foreground hover:text-foreground"
												>
													<rect
														width="14"
														height="14"
														x="8"
														y="8"
														rx="2"
														ry="2"
													/>
													<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
												</svg>
											</Button>
										</div>
									</div>
								</div>

								{errorMessage && (
									<div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md text-sm">
										{errorMessage}
									</div>
								)}

								<Tabs
									defaultValue="balance"
									value={activeTab}
									onValueChange={setActiveTab}
									className="w-full"
								>
									<TabsList className="grid grid-cols-2 mb-4">
										<TabsTrigger value="balance">Balance</TabsTrigger>
										<TabsTrigger value="send">Send</TabsTrigger>
									</TabsList>

									<TabsContent value="balance" className="space-y-4">
										<div className="grid grid-cols-2 gap-2">
											<Button
												className="flex flex-col items-center p-4 h-auto"
												onClick={() => setActiveTab("send")}
											>
												<Send className="h-5 w-5 mb-1" />
												<span className="text-xs">Send</span>
											</Button>
											<Button
												className="flex flex-col items-center p-4 h-auto"
												onClick={handleReceive}
											>
												<Download className="h-5 w-5 mb-1" />
												<span className="text-xs">Receive</span>
											</Button>
										</div>

									</TabsContent>

									<TabsContent value="send" className="space-y-4">
										<div className="space-y-4">
											<div className="space-y-2">
												<Label htmlFor="token-type">Token</Label>
												<Select
													value={selectedToken}
													onValueChange={(value) => setSelectedToken(value)}
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select token" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="SOL">SOL</SelectItem>
														<SelectItem value="USDC">USDC</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div className="space-y-2">
												<Label htmlFor="recipient">Recipient Address</Label>
												<Input
													id="recipient"
													placeholder="Enter Solana address"
													value={recipientAddress}
													onChange={(e) => setRecipientAddress(e.target.value)}
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="amount">Amount ({selectedToken})</Label>
												<Input
													id="amount"
													type="number"
													placeholder="0.00"
													min="0"
													step={selectedToken === "SOL" ? "0.001" : "0.01"}
													value={transferAmount}
													onChange={(e) => setTransferAmount(e.target.value)}
												/>
												<p className="text-xs text-muted-foreground">
													Available:{" "}
													{selectedToken === "SOL"
														? `${walletState.balance.toFixed(5)} SOL`
														: `${walletState.usdcBalance.toFixed(2)} USDC`}
												</p>
											</div>

											<Button
												className="w-full"
												onClick={handleTransfer}
												disabled={
													loading ||
													!recipientAddress ||
													!transferAmount ||
													(selectedToken === "SOL" &&
														parseFloat(transferAmount) > walletState.balance) ||
													(selectedToken === "USDC" &&
														parseFloat(transferAmount) >
														walletState.usdcBalance) ||
													(selectedToken === "USDC" &&
														!walletState.usdcTokenAccount)
												}
											>
												{loading ? "Processing..." : `Send ${selectedToken}`}
											</Button>
										</div>
									</TabsContent>

								</Tabs>
								{walletState.lastFetched && (
									<p className="text-xs text-right mt-2 text-muted-foreground">
										Last updated:{" "}
										{new Date(walletState.lastFetched).toLocaleTimeString()}
									</p>
								)}
							</>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
