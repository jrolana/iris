
import { useAtom } from "jotai";
import { useEffect } from "react";
import { excludedUIDsState, inventorState, isAddNewVerifiedInventorModalOpen, isAdminAddingState, applicationIdState } from "@/atom-states/add-new-verified-inventor-modal";

function useAddNewVerifiedInventorModal(){
    const [isOpen, setIsOpen] = useAtom(isAddNewVerifiedInventorModalOpen);
    const [inventor, setInventor] = useAtom(inventorState);
    const [excludedUIDs, setExcludedUIDs] = useAtom(excludedUIDsState);
    const [applicationId, setApplicationId] = useAtom(applicationIdState);
    const [isAdminAdding, setIsAdminAdding] = useAtom(isAdminAddingState);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    useEffect(() => {
      if (!isOpen) {
        // Reset inventor data when modal is closed
        setInventor(null);
      }
    }, [isOpen, setInventor, setExcludedUIDs, setIsAdminAdding]);

    return {isOpen, openModal, closeModal, inventor, setInventor, excludedUIDs, setExcludedUIDs, isAdminAdding, setIsAdminAdding, applicationId, setApplicationId}
}

export default useAddNewVerifiedInventorModal;