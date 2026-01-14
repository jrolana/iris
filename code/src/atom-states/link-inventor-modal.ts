import { atom } from "jotai";

export const isLinkInventorModalOpen = atom(false);
export const inventorUID = atom<string | null>(null);