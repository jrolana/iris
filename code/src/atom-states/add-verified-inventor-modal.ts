import { InventorType } from "@/lib/types/application";
import { atom } from "jotai";

export const isAddVerifiedInventorModalOpen = atom(false);
export const inventorState = atom<InventorType["Insert"] | null>(null);
export const excludedUIDsState = atom<string[]>([]);