import { isFilesUploadModalOpen } from "@/atom-states/files-upload-modal";
import { useAtom } from "jotai";

function useFilesUploadModal(){
    const [isOpen, setIsOpen] = useAtom(isFilesUploadModalOpen);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    return {isOpen, openModal, closeModal}
}

export default useFilesUploadModal;