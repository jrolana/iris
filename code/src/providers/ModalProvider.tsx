"use client";

import { useEffect, useState } from "react";

function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    //modals can cause hydration error in ssr
    //mounting the modal in useEffect ensures that it is already in client side
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <div className="hidden">Insert modals here...</div>;
}

export default ModalProvider;
