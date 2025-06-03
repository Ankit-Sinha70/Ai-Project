import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footerContent,
  size = 'max-w-sm',
  zIndex = 'z-50',
}) => {
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 ${zIndex}`}
      onClick={onClose} 
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={`bg-gray-700 p-6 rounded-lg shadow-xl text-white w-full ${size} flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h3 id="modal-title" className="text-lg font-semibold">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white ml-auto p-1 rounded-full hover:bg-gray-600"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6 flex-grow overflow-y-auto">{children}</div>

        {footerContent && (
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-600">
            {footerContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal; 