import { useSetAtom } from 'jotai';
import { confirmModalAtom } from '../atom-states/confirm-modal';


interface ConfirmOptions {
  title: string;
  message: string;
}

export const useConfirm = () => {
  const setConfirmState = useSetAtom(confirmModalAtom);

  // returns a Promise that resolves to a boolean
  const confirm = (props: ConfirmOptions): Promise<boolean> => {
    const { title, message } = props;
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