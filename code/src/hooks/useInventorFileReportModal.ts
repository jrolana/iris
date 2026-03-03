import {isInventorFileReportModalOpen, subject as subjectState, reporter as reportState} from "../atom-states/inventor-file-report-modal";
import { useAtom } from "jotai";
import { useEffect } from "react";

function useInventorFileReportModal(){
  const [isOpen, setIsOpen] = useAtom(isInventorFileReportModalOpen);

  const [subject, setSubject] = useAtom(subjectState);
  const [reporter, setReporter] = useAtom(reportState);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset subject and reporter when modal is closed
      setSubject(null);
      setReporter(null);
    }
  }, [isOpen, setSubject, setReporter]);
  return {isOpen, openModal, closeModal, subject, setSubject, reporter, setReporter};
    
}

export default useInventorFileReportModal;