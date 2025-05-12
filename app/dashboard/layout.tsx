import "../globals.css";
import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import type React from "react";
import AuthProtector from "@/components/auth-protector";

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
		  <AuthProtector>
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1">
        <TopNav />
        <div className="container mx-auto p-6 max-w-7xl">
          <main className="w-full">{children}</main>
        </div>
      </div>
    </div>
</AuthProtector>
  );
}
