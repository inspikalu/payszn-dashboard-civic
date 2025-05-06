"use client";

import { useState } from "react";
import { useSettings } from "@/contexts/settings-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner"; // You may need to create this component
import { toast } from "sonner";
import { truncateAddress } from "@/lib/utils";

export default function SettingsPage() {
  const { settings, updateWebhookSettings, loading, error, authReady } =
    useSettings();
  const [webhookUrl, setWebhookUrl] = useState<string>(
    settings.webhookUrl || ""
  );
  const [callbackUrl, setCallbackUrl] = useState<string>(
    settings.callbackUrl || ""
  );
  const [saving, setSaving] = useState<boolean>(false);

  const handleSaveWebhookSettings = async () => {
    try {
      setSaving(true);
      await updateWebhookSettings(webhookUrl, callbackUrl);
      toast.success("Webhook settings saved successfully");
    } catch (err) {
      toast.error("Failed to save webhook settings");
    } finally {
      setSaving(false);
    }
  };

  // Show loading state while authentication or data is loading
  if (!authReady || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
      <Spinner color="secondary" size="lg" />
    </div>
    );
  }

  // Show authentication error state
  if (!authReady) {
    return (
      <div className="container mx-auto py-10">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-600">
              Authentication required. Please log in first.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-600">Error loading settings: {error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">API Settings</h1>
      <Tabs defaultValue="webhooks" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="webhooks">Webhook Configuration</TabsTrigger>
          <TabsTrigger
            value="apikey"
            className="text-gray-400 cursor-not-allowed"
          >
            API Keys
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="text-gray-400 cursor-not-allowed"
          >
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>
                Set up webhooks to receive notifications about transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="webhook-url" className="font-medium">
                  Webhook URL
                </Label>
                <Input
                  id="webhook-url"
                  placeholder="https://your-server.com/webhook"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="border-primary"
                />
                <p className="text-sm text-muted-foreground">
                  We'll send POST requests to this URL when transactions occur
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="callback-url" className="font-medium">
                  Callback URL
                </Label>
                <Input
                  id="callback-url"
                  placeholder="https://your-server.com/callback"
                  value={callbackUrl}
                  onChange={(e) => setCallbackUrl(e.target.value)}
                  className="border-primary"
                />
                <p className="text-sm text-muted-foreground">
                  Users will be redirected to this URL after completing
                  transactions
                </p>
              </div>

              <div className="bg-gray-950 p-4 rounded-md border border-gray-200">
                <h3 className="text-sm font-medium mb-2">
                  Webhook Payload Example
                </h3>
                <pre className="text-xs bg-gray-900 p-3 rounded overflow-x-auto text-white">
                  {`{
  "event": "transaction.completed",
  "transaction_id": "tx_12345",
  "amount": 100.00,
  "currency": "USD",
  "status": "success",
  "timestamp": "2023-07-20T14:30:00Z"
}`}
                </pre>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveWebhookSettings}
                disabled={saving}
                className="relative"
              >
                {saving ? "Saving..." : "Save Webhook Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="apikey">
          <Card className="opacity-50">
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Your API Key</Label>
                <div className="flex">
                  <Input
                    value={settings.apiKey || "No API key generated"}
                    readOnly
                    className="flex-1"
                  />
                  <Button variant="outline" className="ml-2" disabled>
                    Copy
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled>Regenerate API Key</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="opacity-50">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage security settings for your API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>IP Restrictions</Label>
                <Input placeholder="Enter allowed IP addresses" disabled />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled>Save Security Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* API information card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your API Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-gray-400">{settings.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-gray-400">{settings.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Wallet</p>
              <p className="text-gray-400">{truncateAddress(settings.wallet)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p
                className={
                  settings.isActive ? "text-green-600" : "text-red-600"
                }
              >
                {settings.isActive ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
