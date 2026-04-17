import React from "react";
import BaseLayout from "@/layout/BaseLayout";
import { NavItem } from "@/lib/types/nav";
import { GridIcon, TableIcon } from "@/icons";
import { SidebarProvider } from "@/context/SidebarContext";
import TanStackProvider from "@/providers/TanStackProvider";
import UserProvider from "@/providers/UserProvider";

const navItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/up-official" },
  {
    icon: <TableIcon />,
    name: "Applications Registry",
    path: "/up-official/application-registry",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TanStackProvider>
      <UserProvider>
        <SidebarProvider>
          <BaseLayout navItems={navItems}>{children}</BaseLayout>
        </SidebarProvider>
      </UserProvider>
    </TanStackProvider>
  );
}
