import { atom } from "jotai";

export const isAddRequirementsModalOpen = atom(false);
export const ipType = atom<"patent" | "utility_model" | "industrial_design" | "trademark" | "copyright" | null>(null);
export const appId = atom<string | null>(null);
export const accomplishedRequirements = atom<string[]>([]);