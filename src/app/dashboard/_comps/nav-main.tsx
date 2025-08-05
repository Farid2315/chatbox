"use client";

import type React from "react";

import {
  ChevronRight,
  Home,
  User,
  Settings,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      isActive?: boolean;
      icon?: LucideIcon;
    }[];
  }[];
}) {
  const { state, setOpen } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  // Initialize open state based on active items
  useEffect(() => {
    const initialOpenState: Record<string, boolean> = {};
    items.forEach((item) => {
      if (item.isActive) {
        initialOpenState[item.title] = true;
      }
    });
    setOpenItems(initialOpenState);
  }, [items]);

  // Map submenu titles to appropriate icons
  const getIconForSubmenu = (title: string): LucideIcon => {
    const iconMap: Record<string, LucideIcon> = {
      "Account Settings": User,
      "Agents": User,
      "Teams": User,
      "Inboxes": Settings,
      "Labels": Settings,
      "Custom Attributes": Settings,
      "Automation": Settings,
      "Bots": Settings,
      "Macros": Settings,
      "Canned Responses": Settings,
      "Integrations": Settings,
      "Audit Logs": Settings,
      "Custom Roles": Settings,
      "SLA": Settings,
      "Billing": Settings,
    };

    return iconMap[title] || Settings;
  };

  const handleMenuClick = (
    title: string,
    hasSubItems: boolean,
    event: React.MouseEvent
  ) => {
    // If this item doesn't have subitems, just let the navigation happen
    if (!hasSubItems) return;

    // Prevent default navigation for items with submenus
    event.preventDefault();

    // If sidebar is collapsed and item has subitems
    if (isCollapsed && hasSubItems) {
      // First expand the sidebar
      setOpen(true);

      // Then open this specific submenu after a short delay
      // to allow the sidebar expansion animation to complete
      setTimeout(() => {
        setOpenItems((prev) => ({
          ...prev,
          [title]: true, // Always open the submenu, don't toggle
        }));
      }, 150);
    } else {
      // If sidebar is already expanded, toggle the submenu
      setOpenItems((prev) => ({
        ...prev,
        [title]: !prev[title],
      }));
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
        Navigation
      </SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            tooltip="Home"
            onClick={() => {
              if (isCollapsed) {
                setOpen(true);
              }
            }}
            className="hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-purple-600/10 transition-all duration-300 group"
          >
            <Link href="/dashboard">
              <Home className="text-blue-600 group-hover:text-purple-600 transition-colors duration-300" />
              <span className="group-hover:text-blue-600 transition-colors duration-300">Home</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        {items.map((item) => {
          const hasSubItems = !!(item.items && item.items.length > 0);
          const isOpen = openItems[item.title] || false;
          const ItemIcon = item.icon || Settings;

          return (
            <Collapsible
              key={item.title}
              asChild
              open={isOpen}
              onOpenChange={(open) => {
                // Only allow the Collapsible component to control state
                // when we're not in the middle of a sidebar expansion
                if (!isCollapsed || !hasSubItems) {
                  setOpenItems((prev) => ({
                    ...prev,
                    [item.title]: open,
                  }));
                }
              }}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={(e) => handleMenuClick(item.title, hasSubItems, e)}
                    className="hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-purple-600/10 transition-all duration-300 group"
                  >
                    <ItemIcon
                      className={`${
                        item.isActive
                          ? "text-blue-600"
                          : "text-muted-foreground group-hover:text-blue-600"
                      } transition-colors duration-300`}
                    />
                    <span className={`${
                      item.isActive
                        ? "text-blue-600 font-medium"
                        : "group-hover:text-blue-600"
                    } transition-colors duration-300`}>
                      {item.title}
                    </span>
                    {hasSubItems && (
                      <ChevronRight
                        className={`ml-auto transition-transform duration-200 ${
                          isOpen ? "rotate-90" : ""
                        } ${
                          item.isActive
                            ? "text-blue-600"
                            : "text-muted-foreground group-hover:text-purple-600"
                        }`}
                      />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {hasSubItems && (
                  <CollapsibleContent>
                    <SidebarMenuSub className="border-l border-blue-600/30 ml-4">
                      {item.items?.map((subItem) => {
                        const SubIcon = subItem.icon || getIconForSubmenu(subItem.title);
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton 
                              asChild
                              className="hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-purple-600/10 transition-all duration-300 group"
                            >
                              <Link href={subItem.url}>
                                <SubIcon 
                                  className={`${
                                    subItem.isActive
                                      ? "text-blue-600"
                                      : "text-muted-foreground group-hover:text-blue-600"
                                  } transition-colors duration-300`}
                                  size={14}
                                />
                                <span className={`${
                                  subItem.isActive
                                    ? "text-blue-600 font-medium"
                                    : "group-hover:text-blue-600"
                                } transition-colors duration-300`}>
                                  {subItem.title}
                                </span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
} 