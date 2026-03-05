import React from "react";
import BaseLayout from "@/layout/BaseLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <BaseLayout isFullWidth={true} isAdmin={true}>
      {children}
    </BaseLayout>
  );
}
