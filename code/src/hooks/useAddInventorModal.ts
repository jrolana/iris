import { isAddInventorModalOpen, newInventorDetails } from "@/atom-states/add-inventor-modal";
import { useAtom } from "jotai";
import { useEffect } from "react";

function useAddInventorsModal(){
    const [isOpen, setIsOpen] = useAtom(isAddInventorModalOpen);
    const [inventorDetails, setNewInventorDetails] = useAtom(newInventorDetails);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    useEffect(() => {
      if (!isOpen) {
        // Reset new inventor details when modal is closed
        setNewInventorDetails(null);
      }
    }, [isOpen, setNewInventorDetails]);

    return {isOpen, openModal, closeModal, inventorDetails, setNewInventorDetails}
}

export default useAddInventorsModal;