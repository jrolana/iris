import React from "react";
import UsersTable from "@/components/admin/UsersTable";
import RegistrationRequestsTable from "@/components/admin/RegistrationRequestsTable";

export default function UserManagement() {

  return (
    <div className="space-y-5">
      <UsersTable />
             <RegistrationRequestsTable />

    </div>
  );
}
