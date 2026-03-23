"use client";

import NewApplicationFlow from "@/components/application/NewApplicationFlow";
import { ADMIN_NEW_APPLICATION_COPY } from "@/lib/constants/new-application";

export default function AdminNewApplicationPage() {
  return (
    <NewApplicationFlow
      startApplicationPath="/admin/start-application"
      copy={ADMIN_NEW_APPLICATION_COPY}
    />
  );
}
