import { InventorType } from "@/lib/types/application";
import { atom } from "jotai";

export const isAddInventorModalOpen = atom(false);
export const newInventorDetails = atom<InventorType | null>(null);