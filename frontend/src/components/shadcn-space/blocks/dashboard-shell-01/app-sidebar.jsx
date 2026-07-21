"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import Logo from "@/assets/logo/logo";
import { NavMain } from "@/components/shadcn-space/blocks/dashboard-shell-01/nav-main";
import {
  Home,
  LayoutDashboard,
  Users,
  Clock,
  Trash2,
  Settings,
} from "lucide-react";
import { SiteHeader } from "@/components/shadcn-space/blocks/dashboard-shell-01/site-header";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

export const navData = [
  { label: "WORKSPACE", isSection: true },
  { title: "Home", icon: Home, href: "/workspace" },
  { title: "My Canvases", icon: LayoutDashboard, href: "/workspace/myCanvases" },
  { title: "Shared with Me", icon: Users, href: "/workspace/sharedWithMe" },
  { title: "Recents", icon: Clock, href: "/workspace/recents" },
  // { label: "GENERAL", isSection: true },
  // { title: "Trash", icon: Trash2, href: "/trash" },
  // { title: "Settings", icon: Settings, href: "/settings" },
];


const AppSidebar = ({
  children
}) => {
  return (
    <SidebarProvider>
      <Sidebar className="py-4 px-0 bg-background">
        <div className="flex flex-col gap-6 bg-background">

          <SidebarHeader className="py-0 px-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <a href="#" className="w-full h-full">
                  <Logo />
                </a>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent className="overflow-hidden gap-0 px-0">
            <SimpleBar autoHide={true} className="h-full border-b border-border">
              <div className="px-4">
                <NavMain items={navData} />
              </div>
            </SimpleBar>
          </SidebarContent>
        </div>
      </Sidebar>

      <div className="flex flex-1 flex-col">
        <header
          className="sticky top-0 z-50 flex items-center border-b px-6 py-3 bg-background">
          <SiteHeader />
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default AppSidebar;
