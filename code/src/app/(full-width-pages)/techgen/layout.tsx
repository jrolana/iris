'use client'

import React from "react";
import { useRole } from '@/hooks/useRole'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthorized, isLoading } = useRole(['techgen'])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthorized) {
    return <div>You are not authorized to access this page.</div>
  }

  return <>{children}</>;
}
