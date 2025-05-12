"use server";
import { getUser } from "@civic/auth-web3/nextjs";

export async function getCivicUser() {
  try {
    const user = await getUser();
    return user;
  } catch (error) {
    console.log("error", error);
    return null;
  }
}
export async function getAccessToken() {
  try {
    const user = await getUser();
    if(!user?.idToken) throw new Error("Token not found");
    return user?.idToken;
  } catch (error) {
    console.log("Error getting access token: ", error);
  }
}

export async function getUserSolanaWallet() {
  try {
    const user:any = await getUser();
    console.log("Solana address: ", user?.solana?.address);
    if (!user?.solana?.address)
      throw new Error("Wallet not found Please login");
    return user?.solana?.address as string;
  } catch (error) {
    console.log("Error getting user wallet: ", error);
  }
}
export async function isUserLoggedIn(): Promise<boolean> {
  try {
    const user: any = await getUser();
    return user?.isAuthenticated === true;
  } catch (error) {
    console.error("Error getting authentication status:", error);
    return false;
  }
}

