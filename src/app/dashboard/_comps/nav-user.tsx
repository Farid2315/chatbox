"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-gradient-to-r data-[state=open]:from-blue-600/10 data-[state=open]:to-purple-600/10 hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-purple-600/10 transition-all duration-300 group"
            >
              <Avatar className="h-8 w-8 rounded-lg ring-2 ring-blue-600/30 group-hover:ring-blue-600/50 dark:ring-blue-600/20 dark:group-hover:ring-blue-600/40 transition-all duration-300">
                <AvatarImage
                  src={user.avatar}
                  alt={user.name}
                />
                <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-600/30 to-purple-600/30 dark:from-blue-600/20 dark:to-purple-600/20 text-blue-600 font-semibold">
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold group-hover:text-blue-600 transition-colors duration-300">
                  {user.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground group-hover:text-purple-600 transition-colors duration-300" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-card/80 dark:bg-card/60 border-border/40 shadow-lg backdrop-blur-sm"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg ring-1 ring-blue-600/30 dark:ring-blue-600/20">
                  <AvatarImage
                    src={user.avatar}
                    alt={user.name}
                  />
                  <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-600/30 to-purple-600/30 dark:from-blue-600/20 dark:to-purple-600/20 text-blue-600 font-semibold">
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-border/40 to-transparent" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-purple-600/10 focus:bg-gradient-to-r focus:from-blue-600/10 focus:to-purple-600/10 transition-all duration-300 group">
                <Sparkles className="mr-2 h-4 w-4 text-blue-600 group-hover:text-purple-600 transition-colors duration-300" />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">
                  Upgrade to Pro
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-border/40 to-transparent" />
            <DropdownMenuGroup>
              <DropdownMenuItem 
                onClick={() => router.push("/dashboard/profile")}
                className="hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-purple-600/10 hover:text-blue-600 transition-all duration-300"
              >
                <BadgeCheck className="mr-2 h-4 w-4" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => router.push("/dashboard/settings/billing")}
                className="hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-purple-600/10 hover:text-blue-600 transition-all duration-300"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => router.push("/dashboard/notifications")}
                className="hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-purple-600/10 hover:text-blue-600 transition-all duration-300"
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-border/40 to-transparent" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-600/10 hover:text-red-600 transition-all duration-300"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
} 