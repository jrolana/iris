import { UserType } from "@/lib/types/users";
import { atom } from "jotai";

export const userAtom = atom<UserType["Row"] | null | undefined>(undefined);
