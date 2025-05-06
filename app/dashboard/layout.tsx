import "../globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsProvider } from "@/contexts/settings-context";
import type React from "react";
import TanstackQueryProvider from "@/components/tanstack-query-provider";

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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SettingsProvider>
            <TooltipProvider delayDuration={0}>
              <TanstackQueryProvider>
                <div className="min-h-screen flex">
                  <Sidebar />
                  <div className="flex-1">
                    <TopNav />
                    <div className="container mx-auto p-6 max-w-7xl">
                      <main className="w-full">{children}</main>
                    </div>
                  </div>
                </div>
              </TanstackQueryProvider>
            </TooltipProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
