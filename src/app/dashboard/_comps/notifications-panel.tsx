"use client";

import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  title: string;
  date: string;
  read: boolean;
  action: string | null;
}

interface NotificationsPanelProps {
  notifications: Notification[];
}

export function NotificationsPanel({ notifications }: NotificationsPanelProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-blue-600" />
          <span className="font-semibold">Notifications</span>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <X className="h-3 w-3" />
        </Button>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="p-2">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-colors duration-200 ${
                    notification.read
                      ? "bg-transparent hover:bg-muted/50"
                      : "bg-blue-600/10 hover:bg-blue-600/20"
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        notification.read ? "bg-muted-foreground/30" : "bg-blue-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${
                        notification.read ? "text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.date}
                    </p>
                    {notification.action && (
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-xs text-blue-600 hover:text-blue-700 mt-1"
                      >
                        {notification.action}
                      </Button>
                    )}
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
      {notifications.length > 0 && (
        <div className="p-4 border-t border-border/40">
          <Button variant="outline" size="sm" className="w-full">
            View all notifications
          </Button>
        </div>
      )}
    </div>
  );
} 