import {  isStatusUpdateOpen } from "@/atom-states/status-update-modal";
import { useAtom } from "jotai";

function useStatusUpdateModal(){
    const [isOpen, setIsOpen] = useAtom(isStatusUpdateOpen);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    return {isOpen, openModal, closeModal}
}

export default useStatusUpdateModal;