"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, Settings } from "lucide-react";

interface InboxFormData {
  websiteName: string;
  websiteDomain: string;
  widgetColor: string;
  welcomeHeading: string;
  welcomeTagline: string;
  enableChannelGreeting: string;
}

export default function InboxSettingsPage() {
  const [formData, setFormData] = useState<InboxFormData>({
    websiteName: "Demo Center",
    websiteDomain: "www.mobme.org",
    widgetColor: "#3b82f6",
    welcomeHeading: "Hi there!",
    welcomeTagline: "We make it simple to connect with us. Ask us anything, or share your feedback.",
    enableChannelGreeting: "disabled"
  });

  const handleInputChange = (field: keyof InboxFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating inbox with data:", formData);
    // TODO: Implement inbox creation logic
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar - Progress Steps */}
      <div className="w-80 bg-white border-r border-gray-200 p-8">
        <div className="space-y-8">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">Inbox Settings</h1>
          </div>
          
          {/* Progress Steps */}
          <div className="space-y-6">
            {/* Step 1 - Completed */}
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">Step 1: Connect Account</h3>
                <p className="text-sm text-gray-500">Connect your account and authenticate</p>
              </div>
            </div>

            {/* Step 2 - Current */}
            <div className="flex items-start space-x-3">
              <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white text-xs font-medium">2</span>
              </div>
              <div>
                <h3 className="font-medium text-blue-600">Step 2: Create Inbox</h3>
                <p className="text-sm text-blue-600">Authenticate your account and create an inbox.</p>
              </div>
            </div>

            {/* Step 3 - Upcoming */}
            <div className="flex items-start space-x-3">
              <Circle className="h-6 w-6 text-gray-300 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-400">Step 3: Add Agents</h3>
                <p className="text-sm text-gray-400">Add agents to the created inbox.</p>
              </div>
            </div>

            {/* Step 4 - Upcoming */}
            <div className="flex items-start space-x-3">
              <Circle className="h-6 w-6 text-gray-300 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-400">Step 4: Voilà!</h3>
                <p className="text-sm text-gray-400">You are all set to go!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-900">
                Configure Your Inbox
              </CardTitle>
              <p className="text-gray-600">
                Set up your inbox settings to get started with customer conversations.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Website Name */}
                <div className="space-y-2">
                  <Label htmlFor="websiteName" className="text-sm font-medium text-gray-700">
                    Website Name
                  </Label>
                  <Input
                    id="websiteName"
                    value={formData.websiteName}
                    onChange={(e) => handleInputChange("websiteName", e.target.value)}
                    className="w-full"
                    placeholder="Enter your website name"
                  />
                </div>

                {/* Website Domain */}
                <div className="space-y-2">
                  <Label htmlFor="websiteDomain" className="text-sm font-medium text-gray-700">
                    Website Domain
                  </Label>
                  <Input
                    id="websiteDomain"
                    value={formData.websiteDomain}
                    onChange={(e) => handleInputChange("websiteDomain", e.target.value)}
                    className="w-full border-blue-500 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your website domain"
                  />
                </div>

                {/* Widget Color */}
                <div className="space-y-2">
                  <Label htmlFor="widgetColor" className="text-sm font-medium text-gray-700">
                    Widget Color
                  </Label>
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded border-2 border-gray-300"
                      style={{ backgroundColor: formData.widgetColor }}
                    />
                    <Input
                      id="widgetColor"
                      type="color"
                      value={formData.widgetColor}
                      onChange={(e) => handleInputChange("widgetColor", e.target.value)}
                      className="w-20 h-10 p-1 border-0"
                    />
                  </div>
                </div>

                {/* Welcome Heading */}
                <div className="space-y-2">
                  <Label htmlFor="welcomeHeading" className="text-sm font-medium text-gray-700">
                    Welcome Heading
                  </Label>
                  <Input
                    id="welcomeHeading"
                    value={formData.welcomeHeading}
                    onChange={(e) => handleInputChange("welcomeHeading", e.target.value)}
                    className="w-full"
                    placeholder="Enter welcome heading"
                  />
                </div>

                {/* Welcome Tagline */}
                <div className="space-y-2">
                  <Label htmlFor="welcomeTagline" className="text-sm font-medium text-gray-700">
                    Welcome Tagline
                  </Label>
                  <Input
                    id="welcomeTagline"
                    value={formData.welcomeTagline}
                    onChange={(e) => handleInputChange("welcomeTagline", e.target.value)}
                    className="w-full"
                    placeholder="Enter welcome tagline"
                  />
                </div>

                {/* Enable Channel Greeting */}
                <div className="space-y-2">
                  <Label htmlFor="enableChannelGreeting" className="text-sm font-medium text-gray-700">
                    Enable channel greeting
                  </Label>
                  <Select
                    value={formData.enableChannelGreeting}
                    onValueChange={(value) => handleInputChange("enableChannelGreeting", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    Auto-send greeting messages when customers start a conversation and send their first message.
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg"
                >
                  Create inbox
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


