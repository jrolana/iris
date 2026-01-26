import { isLinkInventorModalOpen, inventorUID as inventorUIDState, excludedUIDsState} from "@/atom-states/link-inventor-modal"; 
import { useAtom } from "jotai";
import { useEffect } from "react";

function useLinkInventorModal(){
    const [isOpen, setIsOpen] = useAtom(isLinkInventorModalOpen);
    const [inventorUID, setInventorUID] = useAtom(inventorUIDState);
    const [excludedUIDs, setExcludedUIDs] = useAtom(excludedUIDsState);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    useEffect(() => {
      if (!isOpen) {
        // Reset inventor UID when modal is closed
        setInventorUID(null);
        setExcludedUIDs([]);
      }
    }, [isOpen, setInventorUID, setExcludedUIDs]);

    return {isOpen, openModal, closeModal, inventorUID, setInventorUID, excludedUIDs, setExcludedUIDs}
}

export default useLinkInventorModal;