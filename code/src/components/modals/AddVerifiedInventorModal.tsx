import { useEffect, useState } from "react";
import useAddVerifiedInventorModal from "@/hooks/useAddVerifiedInventorModal";
import Modal from "./Modal";
import SearchTab from "./AddVerifiedInventorModal/SearchTab";
import { ManualTab } from "./AddVerifiedInventorModal/ManualTab";

export default function AddVerifiedInventorModal() {
  const { isOpen, closeModal, excludedUIDs, setInventor } =
    useAddVerifiedInventorModal();

  const [activeTab, setActiveTab] = useState<"search" | "manual">("search");

  useEffect(() => {
    if (!isOpen) setActiveTab("search");
  }, [isOpen]);

  return (
    <Modal
      title="Add Technology Generator"
      description="Search for a verified tech gen or add a new collaborator manually."
      isOpen={isOpen}
      onChange={closeModal}
    >
      {/* Fix: Applied the responsive width constraints from StatusUpdateForm 
        min-w-[85vw] prevents squishing on mobile, sm:min-w-[480px] stabilizes desktop
      */}
      <div className="flex w-full max-w-lg min-w-[85vw] flex-col items-center sm:min-w-[480px]">
        {/* Custom Tab Switcher */}
        <div className="mb-6 flex rounded-lg bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab("search")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all sm:px-6 ${
              activeTab === "search"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Search Verified
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all sm:px-6 ${
              activeTab === "manual"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Add Manually
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="w-full">
          {activeTab === "search" ? (
            <SearchTab
              isOpen={isOpen}
              excludedUIDs={excludedUIDs}
              setInventor={setInventor}
              closeModal={closeModal}
            />
          ) : (
            <ManualTab
              isOpen={isOpen}
              setInventor={setInventor}
              closeModal={closeModal}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
