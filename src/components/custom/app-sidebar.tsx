"use client";

import * as React from "react";
import { useState } from "react";
import {
  Home,
  ListChecks,
  Settings,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, NavLink } from "react-router";

// Sample data for navigation
const navigationItems = [
  {
    id: "home",
    title: "Home",
    icon: Home,
    url: "/",
  },
  {
    id: "api-list",
    title: "API List",
    icon: ListChecks,
    url: "/api-list",
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    url: "/settings",
  },
  {
    id: "help",
    title: "Help",
    icon: HelpCircle,
    url: "/help",
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <Sidebar
      {...props}
      className="border-r border-sidebar-border"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="h-10" />
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <nav className="flex flex-col gap-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-4 rounded-full font-medium transition-all duration-400",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-xl shadow-sidebar-accent/10 justify-center"
                      : "hover:bg-sidebar-accent/20 text-sidebar-foreground justify-start",
                  )
                }
                title={item.title}
                to={item.url}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={24}
                      className={cn(
                        "text-sidebar-accent shrink-0 transition-all duration-200",
                        isActive && "scale-110 text-sidebar-accent-foreground",
                      )}
                    />
                    {isExpanded && (
                      <>
                        <span
                          className={cn(
                            "flex-1 text-left text-sidebar-accent truncate",
                            isActive ? "text-sidebar-accent-foreground" : "",
                          )}
                        >
                          {item.title}
                        </span>
                      </>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
