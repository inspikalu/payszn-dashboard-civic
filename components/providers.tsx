"use client"
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsProvider } from "@/contexts/settings-context";
import { CivicAuthProvider } from "@civic/auth-web3/nextjs";
import TanstackQueryProvider from "@/components/tanstack-query-provider";
import { ConnectionProvider, WalletProvider, useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";


export default function Providers({ children }: { children: React.ReactNode }) {

	const endpoint = "https://api.mainnet-beta.solana.com";
	return (

		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={[]} autoConnect>
				<WalletModalProvider>
					<CivicAuthProvider>
						<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
							<SettingsProvider>
								<TooltipProvider delayDuration={0}>
									<TanstackQueryProvider>
										{children}
									</TanstackQueryProvider>
								</TooltipProvider>
							</SettingsProvider>
						</ThemeProvider>
					</CivicAuthProvider>
				</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	)
}
