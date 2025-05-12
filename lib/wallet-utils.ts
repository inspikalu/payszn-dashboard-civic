import {
    Connection,
    PublicKey,
    Transaction,
    VersionedTransaction,
    SendOptions
} from "@solana/web3.js";

/**
 * Interface for the Solana embedded wallet with essential methods
 */
export interface SolanaEmbeddedWallet {
    address: string;
    chainId: string;
    walletClientType: string;
    signAndSendTransaction: (
        transaction: Transaction | VersionedTransaction,
        options?: SendOptions
    ) => Promise<string>;
    signTransaction: (
        transaction: Transaction | VersionedTransaction
    ) => Promise<Transaction | VersionedTransaction>;
    signMessage: (message: Uint8Array) => Promise<Uint8Array>;
}

/**
 * Gets the embedded Solana wallet from the wallets array
 * @param wallets Array of wallets from useWallets hook
 * @returns The Solana embedded wallet or undefined if not found
 */
/* export const getSolanaEmbeddedWallet = (
    wallets: ConnectedSolanaWallet[]
): SolanaEmbeddedWallet | undefined => {
    return wallets.find(
        (wallet) => {
            return wallet.type === "solana" && wallet.walletClientType === "privy"
        }

    ) as SolanaEmbeddedWallet | undefined;
}; */

/**
 * Utility function to send a Solana transaction using the embedded wallet
 * @param wallet The Solana embedded wallet
 * @param transaction The transaction to send
 * @param connection Solana RPC connection
 * @returns Transaction signature
 */
export const sendSolanaTransaction = async (
    wallet: SolanaEmbeddedWallet,
    transaction: Transaction,
    connection: Connection
): Promise<string> => {
    try {
        // Get recent blockhash
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = new PublicKey(wallet.address);

        // Sign and send transaction
        const signature = await wallet.signAndSendTransaction(transaction);
        return signature;
    } catch (error) {
        console.error("Error sending Solana transaction:", error);
        throw error;
    }
};
