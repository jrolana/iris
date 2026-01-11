import * as Dialog from "@radix-ui/react-dialog";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
}

function Modal(props: ModalProps) {
  const { isOpen, onChange, title, description, children } = props;
  return (
    <Dialog.Root open={isOpen} defaultOpen={isOpen} onOpenChange={onChange}>
      <Dialog.Trigger />
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-999 bg-neutral-800/50 backdrop-blur-xs" />
        <Dialog.Content className="fixed top-[50%] left-[50%] z-9999 h-full max-h-full w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-5 shadow-xl drop-shadow-md focus:outline-none md:h-auto md:max-h-[85vh] md:w-auto">
          <Dialog.Title className="mb-4 text-center text-xl font-bold text-neutral-900">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mb-5 text-center text-sm leading-normal text-slate-600">
            {description}
          </Dialog.Description>
          <div>{children}</div>
          <Dialog.Close asChild>
            <button className="absolute top-2.5 right-2.5 inline-flex h-[25px] w-[25px] cursor-pointer appearance-none items-center justify-center rounded-full text-neutral-400 hover:text-white focus:outline-none">
              <IoMdClose />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Modal;
