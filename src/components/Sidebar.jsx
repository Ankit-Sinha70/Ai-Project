import React from 'react';
import { IoTrashBinSharp } from "react-icons/io5";

function Sidebar({ recentHistory, setSelectedHistory, handleDeleteHistory }) {
  return (
    <div className="md:col-span-1 bg-zinc-800 md:h-screen overflow-y-auto hide-scrollbar">
      <div className="text-sm font-bold text-left p-4 flex flex-col md:max-w-xs h-full">
        <h1 className="text-lg font-bold text-white mb-4 text-center sticky top-0 bg-zinc-800 py-2">
          Recent History
        </h1>
        {recentHistory &&
          recentHistory.map((item, index) => {
            const displayText =
              item.length > 10 ? item.slice(0, 30) + "..." : item;
            return (
              <div
                onClick={() => setSelectedHistory(item)}
                key={index}
                className="flex justify-between items-center w-full mb-1 cursor-pointer"
              >
                <li
                  className="text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-md p-2 truncate max-w-[calc(100%-2.5rem)] list-none"
                  title={item}
                >
                  {displayText}
                </li>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering setSelectedHistory
                    handleDeleteHistory(item);
                  }}
                  className="text-zinc-400 hover:text-red-500 p-2" // Added padding for easier click
                >
                  <IoTrashBinSharp />
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Sidebar; 