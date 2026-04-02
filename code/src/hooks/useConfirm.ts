import { useSetAtom } from 'jotai';
import { confirmModalAtom } from '../atom-states/confirm-modal';

export const useConfirm = () => {
  const setConfirmState = useSetAtom(confirmModalAtom);

  // returns a Promise that resolves to a boolean
  const confirm = (title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title,
        message,
        resolver: resolve, // bake the resolve function into global state
      });
    });
  };

  return confirm;
};