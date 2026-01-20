import { isAddNewUserOpen } from "@/atom-states/add-new-user-modal";
import { useAtom } from "jotai";

function useAddNewUserModal(){
    const [isOpen, setIsOpen] = useAtom(isAddNewUserOpen);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    return {isOpen, openModal, closeModal}
}

export default useAddNewUserModal;