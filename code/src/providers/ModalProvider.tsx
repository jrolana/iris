"use client";

import AddInventorModal from "@/components/modals/AddInventorModal";
import InventorCommentModal from "@/components/modals/InventorCommentModal";
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
      <InventorCommentModal />
    </>
  );
}

export default ModalProvider;
