"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const ipTypeParam = searchParams.get("ipType");

  // TODO: create proper error page for invalid IP Type
  // TODO: create proper type checking utility
  if (
    !ipTypeParam ||
    ![
      "patent",
      "trademark",
      "copyright",
      "utility_model",
      "industrial_design",
    ].includes(ipTypeParam)
  ) {
    return (
      <div className="flex w-full flex-1 flex-row items-center justify-center gap-2">
        Invalid IP Type. Please go back and select a valid IP Type.
      </div>
    );
  }

  return <>{children}</>;
}
