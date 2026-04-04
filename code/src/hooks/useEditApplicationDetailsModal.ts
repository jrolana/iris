import { useAtom } from "jotai";
import { isEditApplicationDetailsOpen } from "@/atom-states/edit-application-details-modal";

function useEditApplicationDetailsModal() {
  const [isOpen, setIsOpen] = useAtom(isEditApplicationDetailsOpen);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return { isOpen, openModal, closeModal };
}

export default useEditApplicationDetailsModal;