import React from "react";
import BaseLayout from "@/layout/BaseLayout";
import { NavItem } from "@/lib/types/nav";
import { GridIcon, TableIcon } from "@/icons";

const navItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/up-official" },
  {
    icon: <TableIcon />,
    name: "Applications Registry",
    path: "/up-official/application-registry",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return <BaseLayout navItems={navItems}>{children}</BaseLayout>;
}
