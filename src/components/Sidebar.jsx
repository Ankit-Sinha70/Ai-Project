import React, { useState } from "react";
import { IoTrashBinSharp } from "react-icons/io5";

const Sidebar = ({
  recentHistory,
  setSelectedHistory,
  handleDeleteHistory,
  isSidebarOpen,
  toggleSidebar,
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowConfirmDialog(true);
  };

  const confirmDeletion = () => {
    if (itemToDelete) {
      handleDeleteHistory(itemToDelete);
    }
    setShowConfirmDialog(false);
    setItemToDelete(null);
  };

  const cancelDeletion = () => {
    setShowConfirmDialog(false);
    setItemToDelete(null);
  };

  return (
    <>
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-3/4 sm:w-1/2 md:w-auto
          md:static md:col-span-1
          h-full p-4 bg-gray-800 
          text-white flex flex-col overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          scrollbar-hide {/* For Firefox */}
          [&::-webkit-scrollbar]:hidden {/* For Webkit browsers like Chrome, Safari */}
          [-ms-overflow-style:none] {/* For IE and Edge */}
        `}
      >
        <button
          onClick={toggleSidebar}
          className="md:hidden text-white absolute top-4 right-4 p-1"
          aria-label="Close sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-4 mt-10 md:mt-0">Recent</h2>
        {recentHistory.length === 0 && (
          <p className="text-gray-400">No recent history.</p>
        )}
        <ul className="space-y-2 flex-1">
          {recentHistory.map((item, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-700 rounded-md cursor-pointer flex justify-between items-center group"
              onClick={() => {
                setSelectedHistory(item);
                if (window.innerWidth < 768) {
                  // 768px is typical 'md' breakpoint
                  toggleSidebar();
                }
              }}
            >
              <span className="truncate pr-2 flex-1">{item}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(item);
                }}
                className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Delete history item: ${item}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.502 0c-.34.055-.68.11-.1.022.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-700 p-6 rounded-lg shadow-xl text-white max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete this history item?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDeletion}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletion}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
