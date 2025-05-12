"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getUserInfo, updateUserTransaction } from "@/lib/auth-functions"; // Adjust path as needed
import { useUser } from "@civic/auth-web3/react";
import { getAccessToken } from "@/lib/get-civic-user";

export interface UserSettings {
  id: number;
  privyId: string;
  name: string;
  email: string;
  wallet: string;
  apiKey: string;
  webhookUrl: string | null;
  callbackUrl: string | null;
  isActive: boolean;
}

const defaultSettings: UserSettings = {
  id: 0,
  privyId: "",
  name: "",
  email: "",
  wallet: "",
  apiKey: "",
  webhookUrl: null,
  callbackUrl: null,
  isActive: true,
};

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  updateWebhookSettings: (
    webhookUrl: string,
    callbackUrl: string
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
  authReady: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const civicUser = useUser();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Get access token when authenticated
  useEffect(() => {
    const fetchAccessToken = async () => {
      if (civicUser.user) {
        try {
          const token = await getAccessToken();
          if (token) {
            setAccessToken(token);
            setAuthReady(true);
          } else {
            throw new Error("Access token not found");
          }
        } catch (err) {
          console.error("Error getting access token:", err);
          setError("Failed to authenticate");
          setAuthReady(true); // Still mark as ready to show error state
        }
      }
    };

    fetchAccessToken();
  }, [civicUser.user, getAccessToken]);

  // Fetch user settings when access token is available
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!accessToken) return;

      try {
        setLoading(true);
        const userData = await getUserInfo(accessToken);
        setSettings(userData);
        setError(null);
      } catch (err) {
        setError("Failed to load user settings");
        console.error("Error fetching user settings:", err);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchUserSettings();
    }
  }, [accessToken]);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updateWebhookSettings = async (
    webhookUrl: string,
    callbackUrl: string
  ) => {
    if (!accessToken) {
      return Promise.reject(new Error("Not authenticated"));
    }

    try {
      setLoading(true);
      await updateUserTransaction(accessToken, { webhookUrl, callbackUrl });
      setSettings((prev) => ({ ...prev, webhookUrl, callbackUrl }));
      setError(null);
      return Promise.resolve();
    } catch (err) {
      setError("Failed to update webhook settings");
      console.error("Error updating webhook settings:", err);
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateWebhookSettings,
        loading,
        error,
        authReady,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
