
import { isInventorViewReportsModalOpen, reports as reportsState} from "@/atom-states/inventor-view-reports-modal";
import { useAtom } from "jotai";
import { useEffect } from "react";

function useInventorViewReportsModal(){
  const [isOpen, setIsOpen] = useAtom(isInventorViewReportsModalOpen);
  const [reports, setReports] = useAtom(reportsState);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset reports when modal is closed
      setReports(null);
    }
  }, [isOpen, setReports]);
  return {isOpen, openModal, closeModal, reports, setReports};
}

export default useInventorViewReportsModal;