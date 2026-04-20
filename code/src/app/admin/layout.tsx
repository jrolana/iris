import React from "react";
import BaseLayout from "@/layout/BaseLayout";
import { NavItem } from "@/lib/types/nav";
import { DocsIcon, GridIcon, TableIcon, UserCircleIcon } from "@/icons";
import { HistoryIcon, CodeXml } from "lucide-react";
import { SidebarProvider } from "@/context/SidebarContext";
import TanStackProvider from "@/providers/TanStackProvider";
import UserProvider from "@/providers/UserProvider";

const navItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/admin" },
  {
    icon: <TableIcon />,
    name: "Applications Registry",
    path: "/admin/application-registry",
  },
  {
    icon: <DocsIcon />,
    name: "Application Documents",
    path: "/admin/application-document",
  },
  {
    icon: <UserCircleIcon />,
    name: "User Management",
    path: "/admin/user-management",
  },
  {
    icon: <CodeXml />,
    name: "Developer Settings",
    path: "/admin/developer-settings",
  },
  {
    icon: <HistoryIcon />,
    name: "Audit Trail",
    path: "/admin/audit-trail",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TanStackProvider>
      <UserProvider>
        <SidebarProvider>
          <BaseLayout navItems={navItems} isAdmin={true}>
            {children}
          </BaseLayout>
        </SidebarProvider>
      </UserProvider>
    </TanStackProvider>
  );
}
