import { excludedUIDsState, inventorState, isAddVerifiedInventorModalOpen } from "@/atom-states/add-verified-inventor-modal";
import { useAtom } from "jotai";
import { useEffect } from "react";

function useAddVerifiedInventorModal(){
    const [isOpen, setIsOpen] = useAtom(isAddVerifiedInventorModalOpen);
    const [inventor, setInventor] = useAtom(inventorState);
    const [excludedUIDs, setExcludedUIDs] = useAtom(excludedUIDsState);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    useEffect(() => {
      if (!isOpen) {
        // Reset inventor data when modal is closed
        setInventor(null);
      }
    }, [isOpen, setInventor, setExcludedUIDs]);

    return {isOpen, openModal, closeModal, inventor, setInventor, excludedUIDs, setExcludedUIDs}
}

export default useAddVerifiedInventorModal;