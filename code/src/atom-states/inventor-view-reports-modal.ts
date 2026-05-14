import { ReportWithRelations } from "@/lib/types/reports";
import { atom } from "jotai";

export const isInventorViewReportsModalOpen = atom(false);
export const reports = atom<ReportWithRelations[] | null>(null);
export const isUneditable = atom(false);
