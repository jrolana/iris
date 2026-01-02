"use client";

import React from "react";
import BaseLayout from "@/layout/BaseLayout";
import { NavItem } from "@/lib/types/nav";
import { GridIcon, TableIcon, UserCircleIcon } from "@/icons";
import { useRole } from "@/hooks/useRole";
import { History, HistoryIcon } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthorized, isLoading } = useRole(["admin"]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // if (!isAuthorized) {
  //   return <div>You are not authorized to access this page.</div>;
  // }

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

  return <BaseLayout navItems={navItems}>{children}</BaseLayout>;
}
