"use client";

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
      <UploadFilesModal />
      <StatusUpdateModal />
    </>
  );
}

export default ModalProvider;
