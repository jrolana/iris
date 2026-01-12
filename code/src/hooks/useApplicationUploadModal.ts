import { isApplicationUploadOpen } from "@/atom-states/application-upload-modal";
import { useAtom } from "jotai";

function useApplicationUploadModal(){
    const [isOpen, setIsOpen] = useAtom(isApplicationUploadOpen);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    return {isOpen, openModal, closeModal}
}

export default useApplicationUploadModal;