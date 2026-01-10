import { isApplicationUploadOpen } from "@/atom-states/application-upload-modal";
import { useAtom } from "jotai";

function useApplicationUploadModal(){
    const [isOpen, setIsAuthOpen] = useAtom(isApplicationUploadOpen);
    const openModal = () => setIsAuthOpen(true);
    const closeModal = () => setIsAuthOpen(false);
    return {isOpen, openModal, closeModal}
}

export default useApplicationUploadModal;