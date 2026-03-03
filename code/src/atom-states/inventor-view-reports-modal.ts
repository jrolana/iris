import { ReportType } from "@/lib/types/reports";
import { atom } from "jotai";

export const isInventorViewReportsModalOpen = atom(false);
export const reports = atom<ReportType["Row"][] | null>(null);