"use client";

import React from "react";
import BaseLayout from "@/layout/BaseLayout";
import { NavItem } from "@/lib/types/nav";
import { GridIcon, TableIcon, DocsIcon, DownloadIcon } from "@/icons";
import { SidebarProvider } from "@/context/SidebarContext";
import TanStackProvider from "@/providers/TanStackProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  const navItems: NavItem[] = [
    { icon: <GridIcon />, name: "Dashboard", path: "/" },
    {
      icon: <TableIcon />,
      name: "Applications Registry",
      path: "/application-registry",
    },
    {
      icon: <DocsIcon />,
      name: "Application Guide",
      path: "/application-guide",
    },
    {
      icon: <DownloadIcon />,
      name: "Application Documents",
      path: "/application-document",
    },
  ];

  return (
    <TanStackProvider>
      <SidebarProvider>
        <BaseLayout navItems={navItems} isPublic={true}>
          {children}
        </BaseLayout>
      </SidebarProvider>
    </TanStackProvider>
  );
}
