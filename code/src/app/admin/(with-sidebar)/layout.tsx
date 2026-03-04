import React from "react";
import BaseLayout from "@/layout/BaseLayout";
import { NavItem } from "@/lib/types/nav";
import { GridIcon, TableIcon, UserCircleIcon } from "@/icons";
import { HistoryIcon } from "lucide-react";

const navItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/admin" },
  {
    icon: <TableIcon />,
    name: "Applications Registry",
    path: "/admin/application-registry",
  },
  {
    icon: <UserCircleIcon />,
    name: "User Management",
    path: "/admin/user-management",
  },
  {
    icon: <HistoryIcon />,
    name: "Audit Trail",
    path: "/admin/audit-trail",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <BaseLayout navItems={navItems} isAdmin={true}>
      {children}
    </BaseLayout>
  );
}
