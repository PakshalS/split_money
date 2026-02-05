import React from "react";
import { Plus, Filter } from "lucide-react";

const BottomActionBar = ({ 
  isDark, 
  isAdmin, 
  onAddClick, 
  onFilterClick,
  filterType 
}) => {
  const filterLabel =
    filterType === "all" ? "All" : filterType === "expense" ? "Expenses" : "Settle-Ups";

  return (
    <div className={`absolute bottom-16 md:bottom-0 left-0 right-0 z-20 ${
      isDark ? "bg-gray-900/95 border-gray-800" : "bg-white/95 border-gray-200"
    } border-t backdrop-blur-md`}>
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
        {/* Filter Button (icon only) */}
        <button
          onClick={onFilterClick}
          aria-label="Filter"
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
            isDark
              ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          <Filter className="w-5 h-5" />
        </button>

        {/* Active filter tag */}
        <div className={`flex-1 h-11 rounded-full px-4 flex items-center ${
          isDark ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"
        }`}>
          <span className="text-sm sm:text-base font-medium truncate">
            {filterLabel}
          </span>
        </div>

        {/* Add Button (Admin Only, icon only) */}
        {isAdmin && (
          <button
            onClick={onAddClick}
            aria-label="Add"
            className={`flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-transform duration-300 hover:scale-105 ${
              isDark ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            <Plus className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default BottomActionBar;
