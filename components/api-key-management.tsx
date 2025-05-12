"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key, Copy, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserInfo, createApiKey } from "@/lib/auth-functions";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@civic/auth-web3/react";
import { getAccessToken } from "@/lib/get-civic-user";

export function ApiKeyManagement() {
  const civicUser: any = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  // Query to fetch user info including API key
  const { data: userInfo, isLoading } = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      if (!civicUser.user) return null;
      const token = await getAccessToken();
      if (!token) throw new Error("Token Not found");
      return getUserInfo(token);
    },
    enabled: !civicUser.user ? false : true,
  });

  // Mutation to create a new API key
  const generateApiKeyMutation = useMutation({
    mutationFn: async () => {
      const token = await getAccessToken();
      if (!token) throw new Error("Token Not found");
      return createApiKey(token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      setIsGenerating(false);
      toast({
        title: "API Key Generated",
        description: "Your new API key has been created successfully.",
      });
    },
    onError: (error) => {
      setIsGenerating(false);
      toast({
        title: "Error",
        description: "Failed to generate API key. Please try again.",
        variant: "destructive",
      });
      console.error("Error generating API key:", error);
    },
  });

  const handleGenerateApiKey = () => {
    setIsGenerating(true);
    generateApiKeyMutation.mutate();
  };

  const copyToClipboard = () => {
    if (userInfo?.apiKey) {
      navigator.clipboard.writeText(userInfo.apiKey);
      toast({
        title: "Copied",
        description: "API key copied to clipboard",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">API Key</CardTitle>
        <Key className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-16 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        ) : userInfo?.apiKey ? (
          <div className="space-y-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Your API Key
              </div>
              <div className="relative">
                <div className="bg-muted p-2 rounded text-sm font-mono truncate pr-10">
                  {userInfo.apiKey}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Keep this key secure. It provides access to your account.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={handleGenerateApiKey}
              disabled={isGenerating}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isGenerating ? "animate-spin" : ""}`}
              />
              Regenerate Key
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-16 flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground mb-2">
                You don't have an API key yet
              </p>
              <p className="text-xs text-muted-foreground">
                Generate a key to integrate with our services
              </p>
            </div>
            <Button
              size="sm"
              className="w-full"
              onClick={handleGenerateApiKey}
              disabled={isGenerating}
            >
              <Key className={`mr-2 h-4 w-4 ${isGenerating ? "hidden" : ""}`} />
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate API Key"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
