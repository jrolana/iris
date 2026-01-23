import { atom } from "jotai";

export const isInventorCommentModalOpen = atom(false);
export const inventorComment = atom<string | null>();
export const inventorIdState = atom<string | null>(null);
export const isAdmin = atom(false);