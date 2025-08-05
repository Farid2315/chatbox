"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export function RouteBreadcrumb() {
  const pathname = usePathname();

  // Skip the first empty segment and format the path segments
  const segments = pathname.split("/").filter(Boolean);

  // Create a mapping of route segments to display names
  const routeNames: Record<string, string> = {
    dashboard: "Dashboard",
    inbox: "My Inbox",
    conversations: "Conversations",
    captain: "Captain",
    contacts: "Contacts",
    reports: "Reports",
    campaigns: "Campaigns",
    help: "Help Center",
    settings: "Settings",
    account: "Account Settings",
    agents: "Agents",
    teams: "Teams",
    inboxes: "Inboxes",
    labels: "Labels",
    "custom-attributes": "Custom Attributes",
    automation: "Automation",
    bots: "Bots",
    macros: "Macros",
    "canned-responses": "Canned Responses",
    integrations: "Integrations",
    "audit-logs": "Audit Logs",
    "custom-roles": "Custom Roles",
    sla: "SLA",
    billing: "Billing",
    profile: "Profile",
    notifications: "Notifications",
  };

  if (segments.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-blue-600 font-medium">Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const path = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;
          const displayName =
            routeNames[segment] ||
            segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <React.Fragment key={path}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-blue-600 font-medium">
                    <Link 
                      href={path} 
                      className="hover:text-purple-600 transition-colors duration-300 hover:underline decoration-purple-600"
                    >
                      {displayName}
                    </Link>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink 
                    href={path}
                    className="text-muted-foreground hover:text-blue-600 transition-colors duration-300 hover:underline decoration-blue-600"
                  >
                    {displayName}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="text-blue-600/50" />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
} 