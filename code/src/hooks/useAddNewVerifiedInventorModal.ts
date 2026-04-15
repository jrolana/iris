
import { useAtom } from "jotai";
import { useEffect } from "react";
import { excludedUIDsState, inventorState, isAddNewVerifiedInventorModalOpen } from "@/atom-states/add-new-verified-inventor-modal";

function useAddNewVerifiedInventorModal(){
    const [isOpen, setIsOpen] = useAtom(isAddNewVerifiedInventorModalOpen);
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

export default useAddNewVerifiedInventorModal;