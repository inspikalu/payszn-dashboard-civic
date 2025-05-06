import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsProvider } from "@/contexts/settings-context";
import { CivicAuthProvider } from "@civic/auth/nextjs";
import type React from "react";

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
        <CivicAuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <SettingsProvider>
              <TooltipProvider delayDuration={0}>
                <PrivyProviderComponent>
                  <TanstackQueryProvider>
                    <main className="w-full">{children}</main>
                  </TanstackQueryProvider>
                </PrivyProviderComponent>
              </TooltipProvider>
            </SettingsProvider>
          </ThemeProvider>
        </CivicAuthProvider>
      </body>
    </html>
  );
}

import "./globals.css";
import PrivyProviderComponent from "@/components/privy-provider";
import TanstackQueryProvider from "@/components/tanstack-query-provider";
