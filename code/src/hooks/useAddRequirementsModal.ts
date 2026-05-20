
import { useAtom } from "jotai";
import { useEffect } from "react";
import { isAddRequirementsModalOpen, ipType as ipTypeState, appId, accomplishedRequirements as accomplishedRequirementsState} from "@/atom-states/add-requirements-modal";

function useAddRequirementsModal(){
    const [isOpen, setIsOpen] = useAtom(isAddRequirementsModalOpen);
    const [ipType, setIpType] = useAtom(ipTypeState);
    const [accomplishedRequirements, setAccomplishedRequirements] = useAtom(accomplishedRequirementsState);
    const [applicationId, setApplicationId] = useAtom(appId);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    useEffect(() => {
      if (!isOpen) {
        // Reset requirement data when modal is closed
        setIpType(null);
        setAccomplishedRequirements([]);
        setApplicationId(null);
      }
    }, [isOpen, setIpType, setAccomplishedRequirements, setApplicationId]);

    return {isOpen, openModal, closeModal, ipType, setIpType, accomplishedRequirements, setAccomplishedRequirements, applicationId, setApplicationId}
}

export default useAddRequirementsModal;