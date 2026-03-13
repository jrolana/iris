import { useRef, useState } from "react";
import { useUpdateInventor } from "@/hooks/inventors/useUpdateInventor";
import { useSearchUsersToLink } from "@/hooks/inventors/useSearchUsersToLink";
import useDebounce from "@/hooks/useDebounce";
import useLinkInventorModal from "@/hooks/useLinkInventorModal";

import Modal from "./Modal";
import SearchInput from "../common/SearchInput";
import { ScrollArea } from "../ui/scroll-area";
import { Cable } from "lucide-react";
import { toast } from "sonner";

export default function LinkInventorModal() {
  const { isOpen, closeModal, inventorUID, excludedUIDs } =
    useLinkInventorModal();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery);
  const {
    inventors: queryResults,
    isFetching: isSearching,
    isLoading: isSearchingLoading,
  } = useSearchUsersToLink({
    queryString: debouncedSearchQuery,
    excludedUserIds: excludedUIDs,
  });
  const { updateInventor, isLoading } = useUpdateInventor();

  const searchInputRef = useRef<HTMLInputElement>(null);

  async function handleLinkClicked(userId: string) {
    if (!inventorUID) {
      toast.error("Failed to link inventor. Please try again.", {
        duration: 3000,
      });
      closeModal();
      return;
    }
    try {
      await updateInventor(
        {
          id: inventorUID,
          inventorData: { techgen_id: userId },
        },
        {
          onSettled: () => {
            closeModal();
          },
          onSuccess: (data) => {
            toast.success(`Successfully linked ${data.full_name}!`, {
              duration: 3000,
            });
          },
        },
      );
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "There was a a problem linking the inventor.",
      );
    } finally {
      closeModal();
    }
  }

  return (
    <Modal
      title="Link Existing Technology Generator"
      description="Allow the tech gen to access and manage their inventions. Remember that accounts cannot be unlinked later."
      isOpen={isOpen}
      onChange={closeModal}
    >
      <div className="w-2xl justify-center px-10">
        <SearchInput
          inputRef={searchInputRef}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search a technology generator with their name or email..."
        />
        <ScrollArea className="mt-2 h-[300px] rounded-md border p-2 pr-4">
          {isSearching || isSearchingLoading ? (
            <div className="mt-28 flex h-full w-full items-center justify-center text-center">
              <p className="text-md mt-4 items-center justify-center text-center text-slate-500">
                Searching tech gens...
              </p>
            </div>
          ) : null}
          {!isSearching && queryResults?.length === 0 && (
            <div className="text-muted-foreground text-md mt-28 flex h-full w-full items-center justify-center text-center">
              No tech gens found. Try adjusting your search.
            </div>
          )}
          {!isSearching && queryResults && queryResults.length > 0 && (
            <ul className="divide-y divide-slate-100">
              {queryResults?.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between py-3 sm:items-start"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-md truncate font-medium text-slate-900">
                      {user.full_name}
                    </p>
                    <p className="text-sm text-slate-600">{user.email}</p>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-sm font-medium text-slate-700 uppercase">
                      {user.external_institution ??
                        user.college_code ??
                        user.other_college_name}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleLinkClicked(user.id)}
                      disabled={isLoading}
                      className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Link Account <Cable size={24} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </div>
    </Modal>
  );
}
