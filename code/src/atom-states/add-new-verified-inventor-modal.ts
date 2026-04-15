import { InventorType } from "@/lib/types/application";
import { atom } from "jotai";

export const isAddNewVerifiedInventorModalOpen = atom(false);
export const inventorState = atom<InventorType["Insert"] | null>(null);
export const excludedUIDsState = atom<string[]>([]);
export const isAdminAddingState = atom(false);