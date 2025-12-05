"use client";

import React from "react";
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import Backdrop from "./Backdrop";
import { NavItem } from "@/lib/types/nav";

interface BaseLayoutProps {
  children: React.ReactNode;
  navItems?: NavItem[];
  othersItems?: NavItem[];
  isPublic?: boolean;
  isFullWidth?: boolean;
}

export default function BaseLayout({
  children,
  navItems,
  othersItems,
  isPublic = false,
  isFullWidth = false,
}: BaseLayoutProps) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Same logic for dynamic main content margin
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
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
        className={`flex-1 transition-all duration-300 ease-in-out ${navItems ? mainContentMargin : ""}`}
      >
        <AppHeader isPublic={isPublic} isFullWidth={isFullWidth} />

        {/* Page Content */}
        <div className="mx-auto max-w-(--breakpoint-2xl) p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
