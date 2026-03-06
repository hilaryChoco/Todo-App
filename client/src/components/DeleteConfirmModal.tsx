import { X, AlertCircle } from "lucide-react";
import { createPortal } from "react-dom";

type Props = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export default function DeleteConfirmModal({ open, onClose, onConfirm }: Props) {

    if (!open) return null;

    return createPortal(
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[999]"
            onClick={onClose}
        >

            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-md rounded-xl shadow-2xl">

                {/* HEADER */}
                <div className="flex justify-between items-center border-b px-6 py-4">

                    <div className="flex items-center gap-2 text-red-600 font-semibold">
                        <AlertCircle size={20} />
                        Delete Task
                    </div>

                    <button
                        onClick={onClose}
                        className="hover:bg-gray-100 p-1 rounded"
                    >
                        <X size={18} />
                    </button>

                </div>

                {/* BODY */}
                <div className="p-6 text-gray-600 text-center">
                    Are you sure you want to delete this task?
                </div>

                {/* FOOTER */}
                <div className="border-t px-6 py-4 flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>,
        document.body
    );
}