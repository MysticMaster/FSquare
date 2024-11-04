import React from "react";

interface ModalContainerProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const ModalContainer: React.FC<ModalContainerProps> = ({isOpen, onClose, children}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-7">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="bg-white rounded-lg shadow-lg p-4 relative z-10 w-auto max-h-[95vh] overflow-y-auto">
                <button
                    className="absolute text-4xl top-1 right-3 text-gray-600 hover:text-gray-800"
                    onClick={onClose}
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );

};

export default ModalContainer;
