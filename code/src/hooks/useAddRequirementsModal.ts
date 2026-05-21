import { useAtom } from "jotai";
import { useEffect } from "react";
import {
  appId,
  existingRequirements as existingRequirementsState,
  ipType as ipTypeState,
  isAddRequirementsModalOpen,
} from "@/atom-states/add-requirements-modal";

function useAddRequirementsModal() {
  const [isOpen, setIsOpen] = useAtom(isAddRequirementsModalOpen);
  const [ipType, setIpType] = useAtom(ipTypeState);
  const [existingRequirements, setExistingRequirements] = useAtom(
    existingRequirementsState,
  );
  const [applicationId, setApplicationId] = useAtom(appId);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset requirement data when modal is closed
      setIpType(null);
      setExistingRequirements([]);
      setApplicationId(null);
    }
  }, [isOpen, setIpType, setExistingRequirements, setApplicationId]);

  return {
    isOpen,
    openModal,
    closeModal,
    ipType,
    setIpType,
    existingRequirements,
    setExistingRequirements,
    applicationId,
    setApplicationId,
  };
}

export default useAddRequirementsModal;
