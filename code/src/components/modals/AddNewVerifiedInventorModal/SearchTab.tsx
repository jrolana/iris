import { useRef, useState } from "react";
import { useSearchUsersToLink } from "@/hooks/inventors/useSearchUsersToLink";
import useDebounce from "@/hooks/useDebounce";
import { useConfirm } from "@/hooks/useConfirm";
import { useAddNewInventor } from "@/hooks/inventors/useAddNewInventor";

import { InventorType } from "@/lib/types/application";
import type { SearchUsersToLinkResult } from "@/services/inventors/search-users-to-link";

import SearchInput from "../../common/SearchInput";
import { Cable } from "lucide-react";
import { ScrollArea } from "../../ui/scroll-area";
import { toast } from "sonner";

interface SearchTabProps {
  excludedUIDs: string[];
  isAdminAdding: boolean;
  applicationId: string;
  closeModal: () => void;
}

export default function SearchTab(props: SearchTabProps) {
  const { excludedUIDs, isAdminAdding, applicationId, closeModal } = props;
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery);
  const confirm = useConfirm();
  const { addNewInventor } = useAddNewInventor();

  const {
    inventors,
    isFetching: isSearching,
    isLoading: isSearchingLoading,
  } = useSearchUsersToLink({
    queryString: debouncedSearchQuery,
    excludedUserIds: excludedUIDs,
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  async function handleAddNewVerifiedInventor(
    techgen: SearchUsersToLinkResult,
  ) {
    const isConfirmed = await confirm({
      title: "Add Technology Generator",
      message: `Are you sure you want to add ${techgen.full_name} as a technology generator?`,
    });

    if (!isConfirmed) {
      closeModal();
      return;
    }

    const inventorData: InventorType["Insert"] = {
      application_id: applicationId,
      techgen_id: techgen.id,
      full_name: techgen.full_name,
      email: techgen.email,
      college_code: techgen.college_code,
      external_institution: techgen.external_institution,
      other_college_name: techgen.other_college_name,
      status: isAdminAdding ? "member" : "pending",
    };

    toast.promise(addNewInventor({ inventorData }), {
      loading: "Adding technology generator...",
      success: "Technology generator added successfully!",
      error: "Failed to add technology generator.",
    });

    closeModal();
  }

  return (
    <div className="flex w-full flex-col">
      <SearchInput
        inputRef={searchInputRef}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search with their name or email..."
      />

      <ScrollArea className="mt-2 h-[300px] w-full rounded-md border p-2">
        {isSearching || isSearchingLoading ? (
          <div className="mt-28 flex h-full w-full items-center justify-center text-center">
            <p className="text-md items-center justify-center text-center text-slate-500">
              Searching tech gens...
            </p>
          </div>
        ) : null}

        {!isSearching && inventors.length === 0 && (
          <div className="text-md text-muted-foreground mt-28 flex h-full w-full items-center justify-center text-center">
            No tech gens found. Try adjusting your search.
          </div>
        )}

        {!isSearching && inventors.length > 0 && (
          <ul className="divide-y divide-slate-100 pr-3">
            {inventors.map((user) => (
              <li
                key={user.id}
                className="flex flex-col items-start justify-between gap-4 py-3 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-md truncate font-medium text-slate-900">
                    {user.full_name}
                  </p>
                  <p className="truncate text-sm text-slate-600">
                    {user.email}
                  </p>
                  <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 uppercase">
                    {user.external_institution ??
                      user.college_code ??
                      user.other_college_name}
                  </span>
                </div>

                <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleAddNewVerifiedInventor(user)}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 sm:w-auto"
                  >
                    Add Verified <Cable size={18} className="hidden sm:block" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
}
