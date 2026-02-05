import React, { useEffect, useRef, useMemo } from "react";
import TransactionBubble from "./TransactionBubble";
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import { Inbox } from "lucide-react";

const TransactionChatView = ({
  expenses,
  transactions,
  currentUserId,
  currentUserName,
  isDark,
  isAdmin,
  filterType,
  onEditExpense,
  onDeleteExpense,
  onEditSettleUp,
  onDeleteSettleUp,
}) => {
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

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
      const createdById = expense.createdBy || expense.createdBy?._id;
      const isMine = createdById ? createdById === currentUserId : false;
      const paidByPrimary = Array.isArray(expense.paidBy) ? expense.paidBy[0] : expense.paidBy;

      allTransactions.push({
        type: "expense",
        id: expense._id,
        timestamp: parseDate(dateField),
        creator: paidByPrimary,
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
      const payerName = transaction.payer?.name;
      const isMine = payerName === currentUserName;

      allTransactions.push({
        type: "settle-up",
        id: transaction._id,
        timestamp: parseDate(dateField),
        creator: transaction.payer,
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

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [groupedByDate]);

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
      // Removed the style={} prop entirely
      className={`flex-1 overflow-y-auto w-full relative no-scrollbar ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Removed the background layer div here */}

      {/* Content Layer */}
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
              <TransactionBubble
                key={item.id}
                transaction={item}
                isMine={item.isMine}
                isDark={isDark}
                isAdmin={isAdmin}
                currentUserId={currentUserId}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default TransactionChatView;