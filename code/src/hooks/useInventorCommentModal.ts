import {inventorComment as inventorCommentState, isInventorCommentModalOpen, isAdmin as isUserAdmin, inventorIdState} from "../atom-states/inventor-comment-modal";
import { useAtom } from "jotai";
import { useEffect } from "react";

function useInventorCommentModal(){
    const [isOpen, setIsOpen] = useAtom(isInventorCommentModalOpen);

    const [inventorComment, setInventorComment] = useAtom(inventorCommentState);
    const [inventorId, setInventorId] = useAtom(inventorIdState)
    const [isAdmin, setIsAdmin] = useAtom(isUserAdmin);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    useEffect(() => {
      if (!isOpen) {
        // Reset inventor comment when modal is closed
        setInventorComment(null);
        setInventorId(null);
      }
    }, [isOpen, setInventorComment, setInventorId]);
    return {isOpen, openModal, closeModal, inventorComment, setInventorComment, inventorId, setInventorId, isAdmin, setIsAdmin};
}

export default useInventorCommentModal;