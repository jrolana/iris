import { isLinkInventorModalOpen, inventorUID as inventorUIDState} from "@/atom-states/link-inventor-modal"; 
import { useAtom } from "jotai";
import { useEffect } from "react";

function useLinkInventorModal(){
    const [isOpen, setIsOpen] = useAtom(isLinkInventorModalOpen);
    const [inventorUID, setInventorUID] = useAtom(inventorUIDState);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    useEffect(() => {
      if (!isOpen) {
        // Reset inventor UID when modal is closed
        setInventorUID(null);
      }
    }, [isOpen, setInventorUID]);

    return {isOpen, openModal, closeModal, inventorUID, setInventorUID}
}

export default useLinkInventorModal;