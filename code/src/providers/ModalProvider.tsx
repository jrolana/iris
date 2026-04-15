"use client";

import { useEffect, useState } from "react";

import AddInventorModal from "@/components/modals/AddInventorModal";
import AddNewUserModal from "@/components/modals/AddNewUserModal";
import AddVerifiedInventorModal from "@/components/modals/AddVerifiedInventorModal";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import InventorFileReportModal from "@/components/modals/InventorFileReportModal";
import InventorViewReportsModals from "@/components/modals/InventorViewReportsModal";
import LinkInventorModal from "@/components/modals/LinkInventorModal";
import StatusUpdateModal from "@/components/modals/StatusUpdateModal";
import UploadFilesModal from "@/components/modals/UploadFilesModal";
import AddNewVerifiedInventorModal from "@/components/modals/AddNewVerifiedInventorModal";
import RemoveInventorModal from "@/components/modals/RemoveInventorModal";

function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    //modals can cause hydration error in ssr
    //mounting the modal in useEffect ensures that it is already in client side
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <LinkInventorModal />
      <UploadFilesModal />
      <StatusUpdateModal />
      <AddInventorModal />
      <InventorFileReportModal />
      <AddNewUserModal />
      <InventorViewReportsModals />
      <AddVerifiedInventorModal />
      <ConfirmationModal />
      <AddNewVerifiedInventorModal />
      <RemoveInventorModal />
    </>
  );
}

export default ModalProvider;
