"use client";

import type * as React from "react";
import { MessageSquare, Users, Settings, Search, Edit3, Inbox, MessageCircle, Bot, BarChart3, Megaphone, Building2, Briefcase, User, Tag, Code, Zap, Shield, Clock, CreditCard } from "lucide-react";
import Link from "next/link";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

// Navigation data based on the images
const navMainData = [
  {
    title: "My Inbox",
    url: "/dashboard/inbox",
    icon: Inbox,
    isActive: false,
  },
  {
    title: "Conversations",
    url: "/dashboard/conversations",
    icon: MessageCircle,
    isActive: false,
  },
  {
    title: "Captain",
    url: "/dashboard/captain",
    icon: Bot,
    isActive: false,
  },
  {
    title: "Contacts",
    url: "/dashboard/contacts",
    icon: Users,
    isActive: false,
  },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: BarChart3,
    isActive: false,
  },
  {
    title: "Campaigns",
    url: "/dashboard/campaigns",
    icon: Megaphone,
    isActive: false,
  },
  {
    title: "Help Center",
    url: "/dashboard/help",
    icon: Building2,
    isActive: false,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    isActive: true,
    items: [
      {
        title: "Account Settings",
        url: "/dashboard/settings/account",
        icon: Briefcase,
        isActive: true,
      },
      {
        title: "Agents",
        url: "/dashboard/settings/agents",
        icon: User,
        isActive: false,
      },
      {
        title: "Teams",
        url: "/dashboard/settings/teams",
        icon: Users,
        isActive: false,
      },
      {
        title: "Inboxes",
        url: "/dashboard/settings/inboxes",
        icon: Inbox,
        isActive: false,
      },
      {
        title: "Labels",
        url: "/dashboard/settings/labels",
        icon: Tag,
        isActive: false,
      },
      {
        title: "Custom Attributes",
        url: "/dashboard/settings/custom-attributes",
        icon: Code,
        isActive: false,
      },
      {
        title: "Automation",
        url: "/dashboard/settings/automation",
        icon: Zap,
        isActive: false,
      },
      {
        title: "Bots",
        url: "/dashboard/settings/bots",
        icon: Bot,
        isActive: false,
      },
      {
        title: "Macros",
        url: "/dashboard/settings/macros",
        icon: MessageSquare,
        isActive: false,
      },
      {
        title: "Canned Responses",
        url: "/dashboard/settings/canned-responses",
        icon: MessageCircle,
        isActive: false,
      },
      {
        title: "Integrations",
        url: "/dashboard/settings/integrations",
        icon: Settings,
        isActive: false,
      },
      {
        title: "Audit Logs",
        url: "/dashboard/settings/audit-logs",
        icon: Clock,
        isActive: false,
      },
      {
        title: "Custom Roles",
        url: "/dashboard/settings/custom-roles",
        icon: Shield,
        isActive: false,
      },
      {
        title: "SLA",
        url: "/dashboard/settings/sla",
        icon: Clock,
        isActive: false,
      },
      {
        title: "Billing",
        url: "/dashboard/settings/billing",
        icon: CreditCard,
        isActive: false,
      },
    ],
  },
];

interface Session {
  user: {
    id: string;
    email: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    emailVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    image?: string | null;
  };
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  session: Session;
}

export function AppSidebar({
  session,
  ...props
}: AppSidebarProps) {
  // Extract user data from session
  const userData = session?.user || {
    name: "Guest User",
    email: "guest@example.com",
    image: null,
    id: "guest_id",
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/40 bg-card/60 dark:bg-card/40 backdrop-blur-sm shadow-lg relative"
      {...props}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/3 via-transparent to-purple-600/3 opacity-50 pointer-events-none"></div>
      
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 bg-card/80 dark:bg-card/60 border-b border-border/40 shadow-lg relative z-10">
        <Link
          href="/"
          className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center transition-all duration-300 hover:opacity-95 hover:scale-105 group relative"
        >
          <div className="flex h-8 w-8 items-center justify-center group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-12 relative">
            {/* Enhanced glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-50 dark:group-hover:opacity-40 transition-opacity duration-300 blur-lg animate-ping"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-30 dark:group-hover:opacity-20 transition-opacity duration-300 blur-md"></div>
            <MessageSquare className="w-full h-full relative z-10 text-blue-600" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-extrabold text-lg tracking-wide uppercase bg-gradient-to-r from-blue-600 via-blue-600/80 to-purple-600 bg-clip-text text-transparent drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
              CHATBOX
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator className="mx-0 w-full bg-gradient-to-r from-transparent via-blue-600/50 to-transparent animate-pulse" />

      <SidebarContent className="bg-card/60 dark:bg-card/40 backdrop-blur-sm relative z-10 flex-1 overflow-y-auto">
        {/* Search Section */}
        <div className="p-4 border-b border-border/40">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-10 py-2 bg-background/50 border border-border/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600/40 transition-all duration-300"
            />
            <Edit3 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 hover:text-blue-600 cursor-pointer transition-colors duration-300" />
          </div>
        </div>

        <NavMain items={navMainData} />
      </SidebarContent>
      
      <SidebarFooter className="bg-card/60 dark:bg-card/40 backdrop-blur-sm border-t border-border/40 shadow-lg relative z-10">
        <NavUser 
          user={{
            name: userData.name || "User",
            email: userData.email,
            avatar: userData.image || "/default-avatar.png",
          }} 
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
} 