import { useEffect, useRef, useState } from "react";

import useLinkInventorModal from "@/hooks/useLinkInventorModal";
import Modal from "./Modal";
import SearchInput from "../common/SearchInput";
import { ScrollArea } from "../ui/scroll-area";

import { dummyInventors } from "@/lib/dummy-data/application";
import { Cable } from "lucide-react";
import { toast } from "sonner";

export default function LinkInventorModal() {
  const { isOpen, closeModal, setInventorUID } = useLinkInventorModal();

  const [searchQuery, setSearchQuery] = useState("");

  const [queryResults, setQueryResults] = useState<typeof dummyInventors>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  function handleLinkClicked(inventorId: string) {
    setInventorUID(inventorId);
    // TODO: perform linking logic here
    closeModal();
    toast.success(`Successfully linked ${inventorId}!`, { duration: 3000 });
  }

  useEffect(() => {
    const results = dummyInventors.filter((inventor) => {
      const query = searchQuery.toLowerCase();
      return (
        inventor.full_name.toLowerCase().includes(query) ||
        inventor.email.toLowerCase().includes(query)
      );
    });
    setQueryResults(results);
  }, [searchQuery]);

  return (
    <Modal
      title="Link Existing Inventor or Collaborator"
      description="Allow the inventor to access and manage their inventions. Remember that accounts cannot be unlinked later."
      isOpen={isOpen}
      onChange={closeModal}
    >
      <div className="w-2xl justify-center px-10">
        <SearchInput
          inputRef={searchInputRef}
          setSearchQuery={setSearchQuery}
          placeholder="Search an inventor with their name or email..."
        />
        <ScrollArea className="mt-2 h-[300px] rounded-md border p-2 pr-4">
          {queryResults.length === 0 && (
            <div className="text-muted-foreground text-md mt-28 flex h-full w-full items-center justify-center text-center">
              No inventors or collaborators found. Try adjusting your search.
            </div>
          )}
          <ul className="divide-y divide-slate-100">
            {queryResults.map((inventor) => (
              <li
                key={inventor.inventorId}
                className="flex items-center justify-between py-3 sm:items-start"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-md truncate font-medium text-slate-900">
                    {inventor.full_name}
                  </p>
                  <p className="text-sm text-slate-600">{inventor.email}</p>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-sm font-medium text-slate-700 uppercase">
                    {inventor.college}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleLinkClicked(inventor.inventorId)}
                    className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Link Account <Cable size={24} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
    </Modal>
  );
}
