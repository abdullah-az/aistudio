import React from 'react';
import { XIcon } from '../icons/XIcon';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className="bg-gray-800 rounded-2xl shadow-2xl shadow-indigo-500/10 border border-gray-700 w-full max-w-md m-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
            <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                <h3 id="modal-title" className="text-lg font-bold text-white">{title}</h3>
                <button
                    onClick={onCancel}
                    className="p-1 rounded-full text-gray-400 hover:bg-gray-700"
                    aria-label="Close"
                >
                    <XIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="mt-4">
                <p className="text-sm text-gray-300">{message}</p>
            </div>
        </div>
        <div className="bg-gray-800/50 px-6 py-4 flex flex-row-reverse gap-3 rounded-b-2xl">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
            onClick={onConfirm}
          >
            تأكيد الحذف
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
            onClick={onCancel}
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;