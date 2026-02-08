import React, { useEffect, useRef, useMemo, forwardRef, useImperativeHandle, useState } from "react";
import TransactionBubble from "./TransactionBubble";
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import { Inbox, ChevronDown } from "lucide-react";

const TransactionChatView = forwardRef(({
  expenses,
  transactions,
  currentUserId,
  currentUserName,
  groupMembers,
  isDark,
  isAdmin,
  filterType,
  onEditExpense,
  onDeleteExpense,
  onEditSettleUp,
  onDeleteSettleUp,
}, ref) => {
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const hasScrolledToBottom = useRef(false);
  const transactionElementsRef = useRef({});
  
  // State for scroll button visibility
  const [showScrollButton, setShowScrollButton] = useState(false);

  // --- Helper Functions ---
  const parseDate = (dateValue) => {
    if (!dateValue) return new Date();
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const mergedTransactions = useMemo(() => {
    const allTransactions = [];
    expenses.forEach((expense) => {
      const dateField = expense.createdAt || expense.date || new Date().toISOString();
      // Handle createdBy being either an ID string or a populated object
      const createdById = typeof expense.createdBy === 'string' 
        ? expense.createdBy 
        : expense.createdBy?._id;
      const isMine = createdById ? createdById === currentUserId : false;
      
      // Use createdBy if available and populated with name, otherwise fall back to first payer
      const creator = (expense.createdBy && typeof expense.createdBy === 'object' && expense.createdBy.name)
        ? expense.createdBy 
        : (Array.isArray(expense.paidBy) ? expense.paidBy[0] : expense.paidBy);

      allTransactions.push({
        type: "expense",
        id: expense._id,
        timestamp: parseDate(dateField),
        creator: creator,
        isMine: isMine,
        data: {
          ...expense,
          description: expense.name || expense.description,
          paidBy: Array.isArray(expense.paidBy) ? expense.paidBy : (expense.paidBy ? [expense.paidBy] : []),
          paidByAll: expense.paidBy || [],
          splitBetween: expense.splitAmongst || expense.splitBetween || [],
        },
      });
    });

    transactions.forEach((transaction) => {
      const dateField = transaction.createdAt || transaction.date || new Date().toISOString();
      // Use createdBy for settle-up transactions if available, otherwise use payer
      const creatorName = transaction.createdBy?.name || transaction.payer?.name;
      const isMine = creatorName === currentUserName;

      allTransactions.push({
        type: "settle-up",
        id: transaction._id,
        timestamp: parseDate(dateField),
        creator: transaction.createdBy || transaction.payer,
        isMine: isMine,
        data: transaction,
      });
    });

    return allTransactions.sort((a, b) => a.timestamp - b.timestamp);
  }, [expenses, transactions, currentUserId, currentUserName]);

  const filteredTransactions = useMemo(() => {
    if (filterType === "all") return mergedTransactions;
    return mergedTransactions.filter((t) => t.type === filterType);
  }, [mergedTransactions, filterType]);

  const groupedByDate = useMemo(() => {
    const groups = [];
    let currentDate = null;
    filteredTransactions.forEach((transaction) => {
      const transactionDate = transaction.timestamp;
      if (!currentDate || !isSameDay(currentDate, transactionDate)) {
        currentDate = transactionDate;
        groups.push({ type: "date-divider", date: transactionDate });
      }
      groups.push(transaction);
    });
    return groups;
  }, [filteredTransactions]);

  // Scroll to bottom ONLY on initial load
  useEffect(() => {
    if (!hasScrolledToBottom.current && chatEndRef.current && groupedByDate.length > 0) {
      chatEndRef.current.scrollIntoView({ behavior: "instant" });
      hasScrolledToBottom.current = true;
    }
  }, [groupedByDate]);

  // --- Scroll Detection Logic ---
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      // Show button if user is more than 300px away from the bottom
      const isUserScrolledUp = scrollHeight - scrollTop - clientHeight > 300;
      setShowScrollButton(isUserScrolledUp);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Expose scrollToTransaction method via ref
  useImperativeHandle(ref, () => ({
    scrollToTransaction: (transactionId, transactionType) => {
      const element = transactionElementsRef.current[transactionId];
      if (element && chatContainerRef.current) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        
        // Add highlight effect
        element.classList.add("highlight-transaction");
        setTimeout(() => {
          element.classList.remove("highlight-transaction");
        }, 2000);
      }
    }
  }));

  const formatDateDivider = (date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  };

  const handleEdit = (transaction) => {
    if (transaction.type === "expense") {
      onEditExpense(transaction.data);
    } else {
      onEditSettleUp && onEditSettleUp(transaction.data);
    }
  };

  const handleDelete = (transaction) => {
    if (transaction.type === "expense") {
      onDeleteExpense(transaction.data);
    } else {
      onDeleteSettleUp && onDeleteSettleUp(transaction.data);
    }
  };

  return (
    <div
      ref={chatContainerRef}
      onScroll={handleScroll}
      className={`expense-timeline flex-1 overflow-y-auto w-full relative no-scrollbar ${
        isDark ? "bg-[#1f2329]" : "bg-[#efe7dd]"
      }`}
    >
      <div className="pb-32 pt-4 px-2 sm:px-6 min-h-full">
        {groupedByDate.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
            <div className={`p-6 rounded-full mb-4 ${isDark ? "bg-gray-800" : "bg-white/50"}`}>
              <Inbox className={`w-12 h-12 ${isDark ? "text-gray-600" : "text-gray-400"}`} />
            </div>
            <p className={`text-lg font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              No transactions yet
            </p>
          </div>
        ) : (
          groupedByDate.map((item, index) => {
            if (item.type === "date-divider") {
              return (
                <div key={`date-${index}`} className="flex justify-center my-6 sticky top-2 z-10">
                  <span className={`px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm backdrop-blur-md ${
                    isDark 
                      ? "bg-[#1e293b]/80 text-gray-300" 
                      : "bg-white/90 text-gray-600 shadow-sm"
                  }`}>
                    {formatDateDivider(item.date)}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className={`${item.type === 'expense' ? 'expense-item' : 'settle-up-item'}`}
                ref={(el) => {
                  if (el) {
                    transactionElementsRef.current[item.id] = el;
                  }
                }}
              >
                <TransactionBubble
                  transaction={item}
                  isMine={item.isMine}
                  groupMembers={groupMembers}
                  isDark={isDark}
                  isAdmin={isAdmin}
                  currentUserId={currentUserId}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* --- SCROLL TO BOTTOM BUTTON --- */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          // Changed bottom-24 to bottom-40 for mobile to clear FAB/Input
          className={`fixed bottom-40 md:bottom-24 right-4 z-50 p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
            isDark 
              ? "bg-gray-700 text-white hover:bg-gray-600 border border-gray-600" 
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          }`}
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .highlight-transaction {
          animation: highlightPulse 0.6s ease-in-out;
        }
        @keyframes highlightPulse {
          0% {
            background-color: rgba(34, 197, 94, 0.3);
          }
          50% {
            background-color: rgba(34, 197, 94, 0.15);
          }
          100% {
            background-color: transparent;
          }
        }
      `}</style>
    </div>
  );
});

TransactionChatView.displayName = "TransactionChatView";

export default TransactionChatView;