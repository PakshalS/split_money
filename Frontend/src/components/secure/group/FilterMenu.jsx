import React from "react";
import { Check } from "lucide-react";

const FilterMenu = ({ isOpen, onClose, isDark, currentFilter, onFilterChange }) => {
  if (!isOpen) return null;

  const filters = [
    { value: "all", label: "All Transactions" },
    { value: "expense", label: "Expenses Only" },
    { value: "settle-up", label: "Settle-Ups Only" }
  ];

  const handleFilterSelect = (filterValue) => {
    onFilterChange(filterValue);
    onClose();
  };

  return (
    <>
      {/* Backdrop - covers entire viewport */}
      <div
        className="fixed inset-0 z-30"
        onClick={onClose}
      />

      {/* Dropdown Menu - positioned above the filter button */}
      <div className={`filter-menu absolute bottom-[60px] lg:bottom-[90px] left-4 mb-2 w-48 rounded-lg shadow-lg border z-40 ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        {filters.map((filter) => {
          const isSelected = currentFilter === filter.value;
          
          return (
            <button
              key={filter.value}
              onClick={() => handleFilterSelect(filter.value)}
              className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-black/10 transition-colors ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {isSelected ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <div className="w-3.5 h-3.5" />
              )}
              {filter.label}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default FilterMenu;
