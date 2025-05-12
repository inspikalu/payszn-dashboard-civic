import axios from "axios";
import { getUserSolanaWallet } from "./get-civic-user";
const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const checkBaseURlAvailable = async function () {
  if (!baseUrl)
    throw new Error(
      "Please provide your backend url in the environment variables"
    );
};

export const createApiKey = async function (accessToken: string) {
  try {
    checkBaseURlAvailable();
    const userWallet = await getUserSolanaWallet();
    const response = await axios.post(
      `${baseUrl}/users/create-api-key?wallet=${userWallet}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    // console.log(response);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

export const getUserInfo = async function (accessToken: string) {
  try {
    checkBaseURlAvailable();
    const userWallet = await getUserSolanaWallet();
    const response = await axios.get(`${baseUrl}/users?wallet=${userWallet}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

export const getUserTransactions = async function (accessToken: string) {
  try {
    checkBaseURlAvailable();
    const userWallet = await getUserSolanaWallet();

    const response = await axios.get(
      `${baseUrl}/users/transactions?wallet=${userWallet}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user transactions:", error);
    throw error;
  }
};

export const updateUserTransaction = async function (
  accessToken: string,
  body: { webhookUrl?: string; callbackUrl?: string },
) {
  try {
    checkBaseURlAvailable();
    const userWallet = await getUserSolanaWallet();

    const response = await axios.patch(
      `${baseUrl}/users?wallet=${userWallet}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating user transaction:", error);
    throw error;
  }
};
