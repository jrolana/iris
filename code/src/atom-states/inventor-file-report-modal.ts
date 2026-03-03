import { atom } from "jotai";
import { InventorType } from "@/lib/types/application";

export const isInventorFileReportModalOpen = atom(false);
export const subject = atom<InventorType["Row"] | null>();
export const reporter = atom<InventorType["Row"] | null>(null);
