import React, { useState, useMemo } from "react";
import { X, Search, ArrowUp } from "lucide-react";
import { format, isToday, isYesterday, isSameDay } from "date-fns";

const SearchSidebar = ({
  isOpen,
  onClose,
  isDark,
  expenses = [],
  transactions = [],
  currentUserId,
  currentUserName,
  onSelectResult,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Parse date helper
  const parseDate = (dateValue) => {
    if (!dateValue) return new Date();
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  // Create searchable items
  const allItems = useMemo(() => {
    const items = [];

    // Add expenses
    expenses.forEach((expense) => {
      const dateField = expense.createdAt || expense.date || new Date().toISOString();
      items.push({
        type: "expense",
        id: expense._id,
        timestamp: parseDate(dateField),
        data: expense,
        searchText: `${expense.name || expense.description} ${expense.amount || ""}`.toLowerCase(),
        displayText: expense.name || expense.description,
        amount: expense.amount,
      });
    });

    // Add settle-ups
    transactions.forEach((transaction) => {
      const dateField = transaction.createdAt || transaction.date || new Date().toISOString();
      items.push({
        type: "settle-up",
        id: transaction._id,
        timestamp: parseDate(dateField),
        data: transaction,
        searchText: `${transaction.payer?.name || ""} ${transaction.receiver?.name || ""} ${transaction.amount || ""}`.toLowerCase(),
        displayText: `${transaction.payer?.name || "Unknown"} paid ${transaction.receiver?.name || "Unknown"}`,
        amount: transaction.amount,
      });
    });

    return items.sort((a, b) => b.timestamp - a.timestamp);
  }, [expenses, transactions]);

  // Filter and search
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allItems.filter((item) => item.searchText.includes(query));
  }, [allItems, searchQuery]);

  // Group by date
  const groupedByDate = useMemo(() => {
    const groups = [];
    let currentDate = null;

    filteredResults.forEach((item) => {
      if (!currentDate || !isSameDay(currentDate, item.timestamp)) {
        currentDate = item.timestamp;
        groups.push({ type: "date-divider", date: currentDate });
      }
      groups.push(item);
    });

    return groups;
  }, [filteredResults]);

  const formatDateDivider = (date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  };

  const handleResultClick = (item) => {
    onSelectResult(item);
    setSearchQuery("");
    onClose();
  };

  const getAmountDisplay = (item) => {
    if (item.type === "settle-up") {
      return `₹${item.amount?.toFixed(0) || "0"}`;
    }
    return `₹${item.amount?.toFixed(0) || "0"}`;
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="hidden md:block absolute inset-0 bg-black/20 backdrop-blur-[2px] z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`absolute top-0 right-0 h-full w-full md:w-[500px] ${
          isDark ? "bg-gray-900" : "bg-white"
        } md:border-l ${isDark ? "md:border-gray-700" : "md:border-gray-200"} shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className={`p-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"} flex-shrink-0`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors duration-300 flex-shrink-0 ${
                  isDark ? "hover:bg-gray-800 text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className={`text-lg font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                Search
              </h2>
            </div>
          </div>

          {/* Search Input */}
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-full border-2 transition-colors ${
              isDark
                ? "bg-gray-800 border-gray-700 focus-within:border-green-500"
                : "bg-gray-100 border-gray-300 focus-within:border-green-500"
            }`}
          >
            <Search className={`w-5 h-5 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
            <input
              type="text"
              placeholder="Search expenses, settle-ups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`flex-1 bg-transparent outline-none text-sm ${
                isDark ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-500"
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`p-1 rounded transition-colors ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {!searchQuery.trim() ? (
            <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
              <div className={`p-4 rounded-full mb-4 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                <Search className={`w-8 h-8 ${isDark ? "text-gray-600" : "text-gray-400"}`} />
              </div>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Start typing to search
              </p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
              <div className={`p-4 rounded-full mb-4 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                <Search className={`w-8 h-8 ${isDark ? "text-gray-600" : "text-gray-400"}`} />
              </div>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                No results found for <span className="font-medium">"{searchQuery}"</span>
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {groupedByDate.map((item, index) => {
                if (item.type === "date-divider") {
                  return (
                    <div key={`date-${index}`} className="flex justify-start py-3 px-2">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          isDark ? "bg-gray-800 text-gray-400" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {formatDateDivider(item.date)}
                      </span>
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleResultClick(item)}
                    className={`w-full text-left p-4 rounded-lg transition-colors flex items-start justify-between gap-3 ${
                      isDark ? "hover:bg-gray-800/70" : "hover:bg-gray-100"
                    }`}
                  >
                    {/* Left content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            item.type === "expense"
                              ? isDark
                                ? "bg-blue-900/30 text-blue-400"
                                : "bg-blue-100 text-blue-700"
                              : isDark
                              ? "bg-green-900/30 text-green-400"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {item.type === "expense" ? "Expense" : "Settle"}
                        </span>
                      </div>

                      <p
                        className={`text-sm font-medium truncate ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {item.displayText}
                      </p>

                      <p className={`text-xs truncate ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                        {format(item.timestamp, "p")}
                      </p>
                    </div>

                    {/* Right content - Amount */}
                    <div className="flex-shrink-0">
                      <p
                        className={`text-sm font-bold ${
                          item.type === "expense"
                            ? isDark
                              ? "text-blue-400"
                              : "text-blue-600"
                            : isDark
                            ? "text-green-400"
                            : "text-green-600"
                        }`}
                      >
                        {getAmountDisplay(item)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </>
  );
};

export default SearchSidebar;
