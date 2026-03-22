"use client";

import NewApplicationFlow from "@/components/application/NewApplicationFlow";
import { TECHGEN_NEW_APPLICATION_COPY } from "@/lib/constants/new-application";

export default function TechGenNewApplicationPage() {
  return (
    <NewApplicationFlow
      startApplicationPath="/techgen/start-application"
      copy={TECHGEN_NEW_APPLICATION_COPY}
    />
  );
}