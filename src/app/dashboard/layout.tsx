import type React from "react";
import { cookies } from "next/headers";
import { Metadata } from 'next';

import "@/app/globals.css";

import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "./_comps/app-sidebar";
import { RouteBreadcrumb } from "./_comps/route-breadcrumb";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { NotificationsPanel } from "./_comps/notifications-panel";
import { ThemeToggle } from "./_comps/theme-toggle";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: 'Dashboard | ChatBox',
  description: 'Manage your conversations, contacts, and chat settings from a single, intuitive dashboard.',
  keywords: [
    'chat dashboard',
    'conversation management',
    'chat control panel',
    'messaging dashboard',
    'chat interface',
    'conversation tracking',
    'chat analytics',
    'messaging management',
    'chat monitoring',
    'conversation analytics'
  ],
  authors: [{ name: 'ChatBox' }],
  creator: 'ChatBox',
  publisher: 'ChatBox',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://chatbox.com/dashboard',
    title: 'ChatBox Dashboard | Conversation Management',
    description: 'Your centralized hub for managing conversations, contacts, and chat settings.',
    siteName: 'ChatBox',
    images: [
      {
        url: 'https://chatbox.com/images/og-dashboard.jpg',
        width: 1200,
        height: 630,
        alt: 'ChatBox Dashboard Interface',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@chatbox',
    creator: '@chatbox',
    title: 'ChatBox Dashboard | Conversation Management',
    description: 'Your centralized hub for managing conversations, contacts, and chat settings.',
    images: ['https://chatbox.com/images/twitter-dashboard.jpg'],
  },
  alternates: {
    canonical: 'https://chatbox.com/dashboard',
  },
  other: {
    'theme-color': '#3b82f6',
    'color-scheme': 'light dark',
    'format-detection': 'telephone=no',
  },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'ChatBox Dashboard',
  description: 'Conversation management and chat analytics dashboard',
  url: 'https://chatbox.com/dashboard',
  applicationCategory: 'Chat Management Tool',
  operatingSystem: 'All',
  provider: {
    '@type': 'Organization',
    name: 'ChatBox',
    url: 'https://chatbox.com',
    logo: 'https://chatbox.com/images/logo.svg',
  },
  offers: {
    '@type': 'Offer',
    category: 'Chat Services Management',
    features: [
      'Conversation Management',
      'Contact Management',
      'Chat Analytics',
      'Message History',
      'Contact Management',
      'Chat Settings',
      'Conversation Reports',
      'Campaign Management'
    ]
  },
  browserRequirements: 'Requires modern web browser with JavaScript enabled',
  permissions: 'User authentication required',
  softwareVersion: '1.0'
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  // Fetch session data
  const session = await auth.api.getSession({
    headers: await headers(),
  }).catch((e) => {
    console.log(e);
    throw redirect("/login");
  });

  console.log("Session:", session);
  
  const freshSession = await auth.api.getSession({
    query: {
      disableCookieCache: true,
    },
    headers: await headers(),
  });

  if(freshSession?.user.emailVerified === false) {
    redirect("/signup?step=3&email=" + encodeURIComponent(session?.user.email || ""));
  }
  
  // Check if user needs to complete onboarding
  const user = freshSession?.user;
  const needsOnboarding = !user?.name || 
                         user.name.split(' ').length < 2;
  
  if (needsOnboarding) {
    redirect("/signup");
  }

  // Sample notifications data
  const notifications = [
    {
      title: "New message from John Doe",
      date: "2 minutes ago",
      read: false,
      action: "View conversation",
    },
    {
      title: "Contact Sarah Wilson added you",
      date: "1 hour ago",
      read: false,
      action: "View profile",
    },
    {
      title: "Weekly conversation report is ready",
      date: "1 day ago",
      read: true,
      action: "View report",
    },
    {
      title: "Campaign 'Summer Sale' completed",
      date: "2 days ago",
      read: true,
      action: null,
    },
    {
      title: "New contact request from Mike Johnson",
      date: "3 days ago",
      read: true,
      action: null,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="h-screen overflow-hidden">
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar
          session={JSON.parse(JSON.stringify(session))}
        />
        <SidebarInset className="flex flex-col h-screen">
          <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card/60 dark:bg-card/40 backdrop-blur-sm border-border/40 shadow-lg relative z-50">
            <div className="flex items-center gap-2 px-4 relative z-10">
              <SidebarTrigger className="-ml-1 hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-purple-600/10 transition-all duration-300" />
              <Separator orientation="vertical" className="mr-2 h-4 bg-gradient-to-b from-blue-600/20 to-purple-600/20" />
              <RouteBreadcrumb />
            </div>
            <div className="flex items-center gap-2 px-4 relative z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Notifications"
                    className="relative hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-purple-600/10 transition-all duration-300 group"
                  >
                    <Bell className="h-5 w-5 text-foreground" />
                    {unreadCount > 0 && (
                      <span 
                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] text-white shadow-lg"
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                        }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[400px] p-0 rounded-xl shadow-lg border border-border/40 bg-card/80 dark:bg-card/60 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300"
                  sideOffset={8}
                >
                  <NotificationsPanel notifications={notifications} />
                </DropdownMenuContent>
              </DropdownMenu>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
          <Toaster />
        </SidebarInset>
      </SidebarProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
    </div>
  );
} 