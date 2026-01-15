import {inventorComment as inventorCommentState, isInventorCommentModalOpen, isAdmin as isUserAdmin} from "../atom-states/inventor-comment-modal";
import { useAtom } from "jotai";
import { useEffect } from "react";

function useInventorCommentModal(){
    const [isOpen, setIsOpen] = useAtom(isInventorCommentModalOpen);
    const [inventorComment, setInventorComment] = useAtom(inventorCommentState);
    const [isAdmin, setIsAdmin] = useAtom(isUserAdmin);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    useEffect(() => {
      if (!isOpen) {
        // Reset inventor comment when modal is closed
        setInventorComment(null);
      }
    }, [isOpen, setInventorComment]);
    return {isOpen, openModal, closeModal, inventorComment, setInventorComment, isAdmin, setIsAdmin};
}

export default useInventorCommentModal;