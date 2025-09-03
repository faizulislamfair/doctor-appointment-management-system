import type { ReactNode } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}


export const Modal = ({ isOpen, onClose, title, children }: Props) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        {children}
        <button
          className="mt-4 text-sm text-gray-500 hover:underline"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};
