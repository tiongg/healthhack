import { PropsWithChildren, useEffect, useRef } from 'react';

type ModalProps = PropsWithChildren<{
  isOpen: boolean;
  onClosed: () => void;
  className?: string;
}>;

export default function Modal({
  isOpen,
  onClosed,
  className,
  children,
}: ModalProps) {
  // deno-lint-ignore no-explicit-any
  const ref = useRef<any>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (isOpen) {
      ref.current.showModal();
    } else {
      ref.current.close();
    }
  }, [isOpen]);

  return (
    <dialog ref={ref} onCancel={onClosed} className={className}>
      {children}
    </dialog>
  );
}
