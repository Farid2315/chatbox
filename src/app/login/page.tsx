"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; // ✅ Our BetterAuth client
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Google login
  const handleGoogleLogin = async () => {
    const result = await authClient.signIn.social({ provider: "google" });
    if (!result.error) {
      // Wait a moment for the session to be established
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      alert(result.error.message);
    }
  };

  // Email/password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await authClient.signIn.email({
      email,
      password,
    });
    if (!result.error) {
      // Wait a moment for the session to be established
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      alert(result.error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">chatbox</h1>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Login to ChatBox
          </h2>
          <p className="text-gray-400">
            Or{" "}
            <Link
              href="/signup"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="bg-gray-800 border-gray-700 shadow-2xl">
          <CardContent className="p-6">
            {/* Google Login Button */}
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:border-gray-500 mb-6 h-12"
            >
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">G</span>
                </div>
                <span>Login with Google</span>
              </div>
            </Button>

            {/* Separator */}
            <div className="relative mb-6">
              <Separator className="bg-gray-600" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Badge className="bg-gray-800 text-gray-400 border-gray-600">
                  OR
                </Badge>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-white text-sm font-medium"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@companyname.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-white text-sm font-medium"
                  >
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-medium mt-6"
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
