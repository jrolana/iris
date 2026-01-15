import { atom } from "jotai";

export const isInventorCommentModalOpen = atom(false);
export const inventorComment = atom<string | null>();
export const isAdmin = atom(false);