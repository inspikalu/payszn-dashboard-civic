"use client";
import { useUser } from "@civic/auth-web3/react";

export function useAuth() {
  const civicUser:any = useUser();
  const isLoading = civicUser?.isLoading;
  const isAuthenticated = civicUser?.isAuthenticated;
  
  return {
    isLoading,
    isAuthenticated,
    user: civicUser?.user,
	solData: civicUser?.solana
  };
}
