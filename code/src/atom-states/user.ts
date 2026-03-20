import { UserType } from '@/lib/types/users';
import { atom } from 'jotai';

export const userAtom = atom<UserType["Row"] & {image_url?: string} | null | undefined>(undefined);