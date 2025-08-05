"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Users,
  Settings,
  LogOut,
  User,
  Mail,
  Calendar,
} from "lucide-react";

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  image?: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        if (!session || !session.data?.user) {
          console.log("❌ No session or user found, redirecting to login");
          router.push("/login");
          return;
        }
        
        console.log("✅ Session found:", session.data.user);
        setUser(session.data.user);

        // Ensure AppUser record exists
        try {
          await fetch("/api/user/create-app-user", {
            method: "POST",
            credentials: "include",
          });
        } catch (error) {
          console.error("Failed to create AppUser record:", error);
        }


      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 light:from-blue-50 light:via-white light:to-purple-50">
      {/* Header */}
      <header className="bg-gray-800/50 dark:bg-gray-800/50 light:bg-white/80 backdrop-blur-sm border-b border-gray-700 dark:border-gray-700 light:border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white dark:text-white light:text-gray-900">ChatBox Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-white dark:text-white light:text-gray-900 text-sm">{user?.name || user?.email}</span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="text-gray-300 dark:text-gray-300 light:text-gray-700 border-gray-600 dark:border-gray-600 light:border-gray-300 hover:bg-gray-700 dark:hover:bg-gray-700 light:hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <Card className="bg-gray-800 dark:bg-gray-800 light:bg-white border-gray-700 dark:border-gray-700 light:border-gray-200">
            <CardHeader>
              <CardTitle className="text-white dark:text-white light:text-gray-900 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Welcome Back!</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400 dark:text-gray-400 light:text-gray-500" />
                  <span className="text-gray-300 dark:text-gray-300 light:text-gray-700">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-400 light:text-gray-500" />
                  <span className="text-gray-300 dark:text-gray-300 light:text-gray-700">
                    Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                  </span>
                </div>
                <Badge className="bg-green-600 text-white">
                  {user?.emailVerified ? "Email Verified" : "Email Pending"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gray-800 dark:bg-gray-800 light:bg-white border-gray-700 dark:border-gray-700 light:border-gray-200">
            <CardHeader>
              <CardTitle className="text-white dark:text-white light:text-gray-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <MessageSquare className="w-4 h-4 mr-2" />
                Start New Chat
              </Button>
              <Button variant="outline" className="w-full border-gray-600 dark:border-gray-600 light:border-gray-300 text-gray-300 dark:text-gray-300 light:text-gray-700 hover:bg-gray-700 dark:hover:bg-gray-700 light:hover:bg-gray-100">
                <Users className="w-4 h-4 mr-2" />
                View Conversations
              </Button>
              <Button variant="outline" className="w-full border-gray-600 dark:border-gray-600 light:border-gray-300 text-gray-300 dark:text-gray-300 light:text-gray-700 hover:bg-gray-700 dark:hover:bg-gray-700 light:hover:bg-gray-100">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="bg-gray-800 dark:bg-gray-800 light:bg-white border-gray-700 dark:border-gray-700 light:border-gray-200">
            <CardHeader>
              <CardTitle className="text-white dark:text-white light:text-gray-900">Your Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 dark:text-gray-300 light:text-gray-700">Total Conversations</span>
                  <Badge className="bg-blue-600">0</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 dark:text-gray-300 light:text-gray-700">Active Chats</span>
                  <Badge className="bg-green-600">0</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 dark:text-gray-300 light:text-gray-700">Messages Sent</span>
                  <Badge className="bg-purple-600">0</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8 bg-gray-800 dark:bg-gray-800 light:bg-white border-gray-700 dark:border-gray-700 light:border-gray-200">
          <CardHeader>
            <CardTitle className="text-white dark:text-white light:text-gray-900">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-600 dark:text-gray-600 light:text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">No recent activity</p>
              <p className="text-gray-500 dark:text-gray-500 light:text-gray-500 text-sm mt-2">Start a conversation to see your activity here</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 