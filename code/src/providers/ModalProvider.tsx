"use client";

import AddInventorModal from "@/components/modals/AddInventorModal";
import AddNewUserModal from "@/components/modals/AddNewUserModal";
import AddVerifiedInventorModal from "@/components/modals/AddVerifiedInventorModal";
import InventorFileReportModal from "@/components/modals/InventorFileReportModal";
import InventorViewReportsModals from "@/components/modals/InventorViewReportsModal";
import LinkInventorModal from "@/components/modals/LinkInventorModal";
import StatusUpdateModal from "@/components/modals/StatusUpdateModal";
import UploadFilesModal from "@/components/modals/UploadFilesModal";
import { useEffect, useState } from "react";

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
    </>
  );
}

export default ModalProvider;
