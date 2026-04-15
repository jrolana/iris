import Modal from "./Modal";
import useAddNewVerifiedInventorModal from "@/hooks/useAddNewVerifiedInventorModal";

import SearchTab from "./AddVerifiedInventorModal/SearchTab";

export default function AddNewVerifiedInventorModal() {
  const { isOpen, closeModal, excludedUIDs, setInventor } =
    useAddNewVerifiedInventorModal();

  return (
    <Modal
      title="Add Technology Generator"
      description="Search for a verified tech gen or add a new collaborator manually."
      isOpen={isOpen}
      onChange={closeModal}
    >
      <div className="flex w-full max-w-lg min-w-[85vw] flex-col items-center sm:min-w-[480px]">
        <SearchTab
          excludedUIDs={excludedUIDs}
          setInventor={setInventor}
          closeModal={closeModal}
        />
      </div>
    </Modal>
  );
}
