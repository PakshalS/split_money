import React, { useState } from "react";
import {
  Receipt,
  HandCoins,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Edit,
  Trash2,
  CheckCheck,
} from "lucide-react";
import { format } from "date-fns";

const TransactionBubble = ({
  transaction,
  isMine,
  groupMembers,
  isDark,
  isAdmin,
  onEdit,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isExpense = transaction.type === "expense";
  const canEdit = isAdmin && isExpense;

  const formatTime = (date) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return "";
      return format(dateObj, "h:mm a");
    } catch (error) {
      return "";
    }
  };

  const getInitials = (name) => {
    return name ? name.substring(0, 2).toUpperCase() : "??";
  };

  // Logic to determine if "All" members are involved
  // We compare the length of the list in the transaction vs the total group members
  const isPaidByAll =
    groupMembers && transaction.data.paidByAll?.length === groupMembers.length;
  const isSplitByAll =
    groupMembers &&
    transaction.data.splitBetween?.length === groupMembers.length;

  // Extract creator name from various possible structures
  const senderName = 
    transaction.creator?.name || 
    (typeof transaction.creator === 'string' ? transaction.creator : null) ||
    "Unknown";

  return (
    // Outer Container: Aligns Avatar + Content Block
    <div
      className={`group flex w-full mb-3 gap-3 ${isMine ? "justify-end" : "justify-start"}`}
    >
      {/* 1. Avatar (Top Aligned, Left Side) */}
      {!isMine && (
        <div className="flex-shrink-0 mt-0">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
              // Purple avatar
              isDark ? "bg-[#5b21b6] text-white" : "bg-purple-600 text-white"
            }`}
          >
            {getInitials(senderName)}
          </div>
        </div>
      )}

      {/* 2. Content Column: Name + Bubble */}
      <div
        className={`relative max-w-[85%] sm:max-w-[70%] md:max-w-[60%] flex flex-col ${isMine ? "items-end" : "items-start"}`}
      >
        {/* Sender Name (Outside Bubble) */}
        {!isMine && (
          <span
            className={`text-[12px] font-semibold mb-1 ml-1 ${isDark ? "text-blue-400" : "text-blue-600"}`}
          >
            {senderName}
          </span>
        )}

        {/* 3. The Message Bubble */}
        <div
          onClick={() => isExpense && setIsExpanded(!isExpanded)}
          className={`relative px-3 pt-3 pb-2 shadow-sm cursor-pointer transition-all duration-200
            ${
              isMine
                ? `rounded-xl rounded-tr-none ${isDark ? "bg-[#005c4b] text-white" : "bg-[#d9fdd3] text-gray-900"}`
                : `rounded-xl rounded-tl-none ${isDark ? "bg-[#1e293b] text-gray-100" : "bg-white text-gray-900"}`
            }
          `}
        >
          {/* Admin Menu */}
          {canEdit && (
            <div className="absolute top-1 right-1 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className={`p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                  isDark
                    ? "text-gray-400 hover:text-white hover:bg-white/10"
                    : "text-gray-500 hover:text-black hover:bg-black/5"
                }`}
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div
                  className={`absolute right-0 top-6 w-32 rounded-md shadow-xl py-1 z-50 overflow-hidden border ${
                    isDark
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-100"
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(transaction);
                      setShowMenu(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 text-xs hover:bg-opacity-10 ${isDark ? "text-gray-200 hover:bg-white" : "text-gray-700 hover:bg-black"}`}
                  >
                    <Edit className="w-3 h-3 mr-2" /> Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(transaction);
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-3 h-3 mr-2" /> Delete
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div
            className={`flex flex-col ${isExpense ? "min-w-[240px]" : "min-w-[160px]"}`}
          >
            {/* Header: Icon + "EXPENSE" */}
            <div
              className={`flex items-center gap-1.5 mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              {isExpense ? (
                <Receipt className="w-3 h-3" />
              ) : (
                <HandCoins className="w-3 h-3" />
              )}
              <span className="text-[10px] uppercase font-bold tracking-wider">
                {isExpense ? "Expense" : "Payment"}
              </span>
            </div>

            {isExpense ? (
              <>
                {/* Description */}
                <h4
                  className={`text-base font-medium mb-3 leading-snug ${isDark ? "text-gray-100" : "text-gray-800"}`}
                >
                  {transaction.data.description}
                </h4>

                {/* Amount Box */}
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1 border-l-4 ${
                    isDark
                      ? "bg-[#0f172a]/50 border-green-500"
                      : "bg-gray-100 border-green-500"
                  }`}
                >
                  <span
                    className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Total:
                  </span>
                  {/* CHANGED TO WHITE TEXT */}
                  <span className={`text-xl font-bold mt-1 ${isDark ? "text-white" : "text-gray-600"}`}>               

                    ₹{Number(transaction.data.amount || 0).toFixed(2)}
                  </span>
                </div>

                {/* Collapsible Details */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"}`}
                >
                  <div
                    className={`pt-2 border-t border-dashed ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    {/* Paid By */}
                    <div className="mb-2">
                      <p
                        className={`text-[10px] font-bold uppercase mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        Paid By
                      </p>

                      {/* Logic: Show "All" if everyone is included, otherwise map the list */}
                      {isPaidByAll ? (
                        <div
                          className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}
                        >
                          All
                        </div>
                      ) : (
                        transaction.data.paidByAll?.map((p, i) => (
                          <div
                            key={i}
                            className={`flex justify-between text-xs mb-0.5 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                          >
                            <span>{p.name}</span>
                            <span className="font-mono opacity-80">
                              ₹{p.amount}
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Split Info */}
                    <div>
                      <p
                        className={`text-[10px] font-bold uppercase mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        Split With
                      </p>

                      {/* Logic: Show "All" if everyone is included, otherwise map the list */}
                      {isSplitByAll ? (
                        <div
                          className={`text-[10px] inline-block px-1.5 py-0.5 rounded ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"}`}
                        >
                          All
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {transaction.data.splitBetween?.map((u, i) => (
                            <span
                              key={i}
                              className={`text-[10px] px-1.5 py-0.5 rounded ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"}`}
                            >
                              {u.name || u.user?.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Chevron */}
                <div className="flex justify-center -mt-1 mb-1">
                  {isExpanded ? (
                    <ChevronUp
                      className={`w-3 h-3 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                    />
                  ) : (
                    <ChevronDown
                      className={`w-3 h-3 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                    />
                  )}
                </div>
              </>
            ) : (
              // Settle Up
              <div className="py-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">
                    {transaction.data.payer?.name}
                  </span>
                  <span className="opacity-60 text-xs">paid</span>
                  <span className="font-semibold">
                    {transaction.data.receiver?.name}
                  </span>
                </div>
                {/* CHANGED TO WHITE TEXT */}
                <div
                  className={`text-xl font-bold mt-1 ${isDark ? "text-white" : "text-gray-600"}`}
                >
                  ₹{Number(transaction.data.amount || 0).toFixed(2)}
                </div>
                
                {/* Show createdBy user if available, otherwise fallback */}
                {transaction.data.createdBy && (
                  <div className={`text-[10px] mt-2 pt-2 border-t border-dashed ${isDark ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"}`}>
                    <span>Recorded by: </span>
                    <span className={`font-semibold ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      {typeof transaction.data.createdBy === 'string' 
                        ? transaction.data.createdBy 
                        : transaction.data.createdBy.name || 'Unknown'}
                    </span>
                  </div>
                ) || transaction.creator ? (
                  <div className={`text-[10px] mt-2 pt-2 border-t border-dashed ${isDark ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"}`}>
                    <span>Recorded by: </span>
                    <span className={`font-semibold ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                      {transaction.creator?.name || 'Unknown'}
                    </span>
                  </div>
                ) : null}
              </div>
            )}

            {/* Footer: Time */}
            <div className={`flex items-center justify-end gap-1 mt-0`}>
              <span
                className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                {formatTime(transaction.timestamp)}
              </span>
              {isMine && (
                <CheckCheck
                  className={`w-3 h-3 ${isDark ? "text-blue-400" : "text-blue-500"}`}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {showMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default TransactionBubble;
