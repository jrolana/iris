import React from "react";
import BaseLayout from "@/layout/BaseLayout";
import { NavItem } from "@/lib/types/nav";
import { GridIcon, DocsIcon, DownloadIcon, TableIcon } from "@/icons";

const navItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/techgen" },
  {
    icon: <TableIcon />,
    name: "Applications Registry",
    path: "/techgen/application-registry",
  },
  {
    icon: <DocsIcon />,
    name: "Application Guide",
    path: "/techgen/application-guide",
  },
  {
    icon: <DownloadIcon />,
    name: "Application Documents",
    path: "/techgen/application-document",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return <BaseLayout navItems={navItems}>{children}</BaseLayout>;
}
