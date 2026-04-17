import React from "react";
import BaseLayout from "@/layout/BaseLayout";
import { SidebarProvider } from "@/context/SidebarContext";
import TanStackProvider from "@/providers/TanStackProvider";
import UserProvider from "@/providers/UserProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TanStackProvider>
      <UserProvider>
        <SidebarProvider>
          <BaseLayout isFullWidth={true}>{children}</BaseLayout>
        </SidebarProvider>
      </UserProvider>
    </TanStackProvider>
  );
}
