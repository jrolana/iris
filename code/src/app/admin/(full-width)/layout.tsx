"use client";

import React from "react";
import BaseLayout from "@/layout/BaseLayout";
import { useRole } from "@/hooks/useRole";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthorized, isLoading } = useRole(["admin"]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return <div>You are not authorized to access this page.</div>;
  }

  return <BaseLayout isFullWidth={true}>{children}</BaseLayout>;
}
