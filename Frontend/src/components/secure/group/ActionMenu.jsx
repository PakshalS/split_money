import React from "react";
import { Receipt, HandCoins } from "lucide-react";

const ActionMenu = ({ isOpen, onClose, isDark, onAddExpense, onSettleUp, buttonRef }) => {
  if (!isOpen) return null;

  const handleAddExpense = () => {
    onAddExpense();
    onClose();
  };

  const handleSettleUp = () => {
    onSettleUp();
    onClose();
  };

  return (
    <>
      {/* Backdrop - covers entire viewport */}
      <div
        className="fixed inset-0 z-30"
        onClick={onClose}
      />

      {/* Dropdown Menu - positioned above the button */}
      <div className={`absolute bottom-[70px] right-4 w-48 rounded-lg shadow-lg border z-40 ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <button
          onClick={handleAddExpense}
          className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-black/10 transition-colors ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          Add Expense
        </button>
        <button
          onClick={handleSettleUp}
          className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-black/10 transition-colors ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          <HandCoins className="w-3.5 h-3.5" />
          Settle Up
        </button>
      </div>
    </>
  );
};

export default ActionMenu;
