"use client";

import React from "react";
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import Backdrop from "./Backdrop";
import { NavItem } from "@/lib/types/nav";
import ModalProvider from "@/providers/ModalProvider";

interface BaseLayoutProps {
  children: React.ReactNode;
  navItems?: NavItem[];
  othersItems?: NavItem[];
  isPublic?: boolean;
  isFullWidth?: boolean;
  isAdmin?: boolean;
}

export default function BaseLayout({
  children,
  navItems,
  othersItems,
  isPublic = false,
  isFullWidth = false,
  isAdmin = false,
}: BaseLayoutProps) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Same logic for dynamic main content margin
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <div className="flex min-h-screen flex-col xl:flex-row">
      <ModalProvider />
      {/* Sidebar + Backdrop */}
      {!isFullWidth && navItems && (
        <AppSidebar
          navItems={navItems}
          othersItems={othersItems}
          isPublic={isPublic}
        />
      )}
      {navItems && <Backdrop />}

      <div
        className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${navItems ? mainContentMargin : ""}`}
      >
        <AppHeader
          isPublic={isPublic}
          isFullWidth={isFullWidth}
          isAdmin={isAdmin}
        />

        {/* Page Content */}
        <div className="mx-auto flex w-full max-w-(--breakpoint-2xl) flex-1 flex-col p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
