import { atom } from 'jotai';

type ConfirmState = {
  isOpen: boolean;
  title: string;
  message: string;
  // holds the `resolve` part of the Promise
  resolver: ((value: boolean) => void) | null; 
};

export const confirmModalAtom = atom<ConfirmState>({
  isOpen: false,
  title: '',
  message: '',
  resolver: null,
});