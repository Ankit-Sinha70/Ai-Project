import React, { useEffect, useState } from "react";
import { IoTrashBinSharp } from "react-icons/io5";
import ProfileSection from "./ProfileSection";

const Sidebar = ({
  recentHistory,
  setSelectedHistory,
  handleDeleteHistory,
  isSidebarOpen,
  toggleSidebar,
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("theme");
      return savedMode || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    console.log("Current mode:", darkMode);
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", darkMode);
    }
  }, [darkMode]);

  const filteredHistory = recentHistory.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div>
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-3/4 sm:w-1/2 md:w-auto
          md:static md:col-span-1
          h-screen bg-white dark:bg-gray-800 
          text-gray-900 dark:text-white flex flex-col 
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <button
          onClick={toggleSidebar}
          className="md:hidden text-gray-700 dark:text-white absolute top-4 right-4 p-1"
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

        <div className="flex flex-col h-full p-4">
          <div className="flex-none">
            <h2 className="text-xl font-semibold mb-4 mt-10 md:mt-0">Recent</h2>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 
                         text-gray-900 dark:text-white rounded-md
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {filteredHistory.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? "No matching history found."
                  : "No recent history."}
              </p>
            )}
            <ul className="space-y-2">
              {filteredHistory.map((item, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer flex justify-between items-center group"
                  onClick={() => {
                    setSelectedHistory(item);
                    if (window.innerWidth < 768) {
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
                    className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Delete history item: ${item}`}
                  >
                    <IoTrashBinSharp className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-none mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
            <ProfileSection />
            <div className="mt-2">
              <select
                name="theme"
                id="theme-select"
                className="w-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={darkMode}
                onChange={(e) => setDarkMode(e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-xl text-gray-900 dark:text-white max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete this history item?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDeletion}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white rounded-md text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletion}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-500 rounded-md text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
