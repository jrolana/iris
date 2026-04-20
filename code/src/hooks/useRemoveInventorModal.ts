
import { isRemoveInventorModalOpen } from "@/atom-states/remove-inventor-modal";
import { useAtom } from "jotai";

function useRemoveInventorModal(){
    const [isOpen, setIsOpen] = useAtom(isRemoveInventorModalOpen);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

   

    return {isOpen, openModal, closeModal, }
}

export default useRemoveInventorModal;