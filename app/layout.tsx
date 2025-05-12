import "./globals.css";
import { Inter } from "next/font/google";

import "./globals.css";
import type React from "react";
import Providers from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "PaySZN",
	description:
		"PaySZN is a fast, secure, and developer-friendly crypto payment SDK for seamless blockchain transactions. Easily integrate payments into your dApp with instant settlements and multi-wallet support.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<Providers>
					<main className="w-full">{children}</main>
				</Providers>
			</body>
		</html>
	);
}
