import React from "react";

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null; // 當 isOpen 為 false 時，不顯示模態框

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full relative">
                {/* 關閉按鈕 */}
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
}

export default Modal;
