
import { isInventorViewReportsModalOpen, subject as subjectState} from "@/atom-states/inventor-view-reports-modal";
import { useAtom } from "jotai";
import { useEffect } from "react";

function useInventorViewReportsModal(){
  const [isOpen, setIsOpen] = useAtom(isInventorViewReportsModalOpen);
  const [subject, setSubject] = useAtom(subjectState);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset subject when modal is closed
      setSubject(null);
    }
  }, [isOpen, setSubject]);
  return {isOpen, openModal, closeModal, subject, setSubject};
}

export default useInventorViewReportsModal;