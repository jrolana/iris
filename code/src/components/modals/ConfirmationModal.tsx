import { useAtom } from "jotai";
import { confirmModalAtom } from "../../atom-states/confirm-modal";

import Modal from "./Modal";

function ConfirmationModal() {
  const [modalState, setModalState] = useAtom(confirmModalAtom);

  if (!modalState.isOpen) return null;

  const closeAndResolve = (result: boolean) => {
    // resolve the promise waiting in the component that triggered this
    if (modalState.resolver) {
      modalState.resolver(result);
    }
    // reset and close the modal
    setModalState({ isOpen: false, title: "", message: "", resolver: null });
  };

  return (
    <Modal
      title={modalState.title}
      description={modalState.message}
      isOpen={modalState.isOpen}
      onChange={() => closeAndResolve(false)}
    >
      <div className="w-full max-w-lg min-w-[85vw] justify-center px-0 sm:max-h-[90vh] sm:w-[80vh] sm:min-w-[400px] sm:px-10">
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => closeAndResolve(false)}
            className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => closeAndResolve(true)}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmationModal;
