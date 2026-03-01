import { InventorType } from "@/lib/types/application";
import { atom } from "jotai";

export const isInventorViewReportsModalOpen = atom(false);
export const subject = atom<InventorType["Row"] | null>(null);
export const reporter = atom<InventorType["Row"] | null>(null);