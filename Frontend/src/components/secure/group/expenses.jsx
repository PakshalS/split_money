import React, { useState, Suspense, lazy } from "react";
import { Receipt, ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react";

const EditExpenseForm = lazy(() => import("../admin/editexpense"));
const DeleteExpenseForm = lazy(() => import("../admin/deleteexpense"));

const ExpensesComponent = ({ expenses, isAdmin, groupId, onExpenseUpdated }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedExpense, setExpandedExpense] = useState(null);
  const [isEditExpenseOpen, setIsEditExpenseOpen] = useState(false);
  const [isDeleteExpenseOpen, setIsDeleteExpenseOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const toggleExpense = (expenseId) => {
    setExpandedExpense(expenseId === expandedExpense ? null : expenseId);
  };

  const toggleEditExpenseForm = (expense) => {
    setSelectedExpense(expense);
    setIsEditExpenseOpen(!isEditExpenseOpen);
  };

  const toggleDeleteExpenseForm = (expense) => {
    setSelectedExpense(expense);
    setIsDeleteExpenseOpen(!isDeleteExpenseOpen);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl border border-gray-800 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="p-1.5 sm:p-2 bg-green-700/10 rounded-lg flex-shrink-0">
            <Receipt className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xl sm:text-2xl font-bold text-white truncate">Expenses</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">{expenses.length} expense(s) recorded</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 sm:gap-2 text-green-700 hover:text-green-400 transition-colors duration-300 flex-shrink-0"
        >
          {isExpanded ? (
            <>
              <span className="text-xs sm:text-sm font-medium">Hide</span>
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </>
          ) : (
            <>
              <span className="text-xs sm:text-sm font-medium">Show</span>
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
            </>
          )}
        </button>
      </div>

      {/* Expenses List */}
      {isExpanded && (
        <>
          {expenses.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <Receipt className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 opacity-30" />
              <p className="text-base sm:text-lg">No expenses recorded</p>
              <p className="text-xs sm:text-sm mt-2">Add expenses to track spending</p>
            </div>
          ) : (
            <div className={`space-y-2 sm:space-y-3 ${expenses.length > 3 ? 'max-h-[300px] sm:max-h-[350px] md:max-h-[400px] overflow-y-auto scrollbar-hide' : ''}`}>
              {expenses.map((expense, index) => {
                const isExpenseExpanded = expandedExpense === expense._id;
                return (
                  <div
                    key={expense._id}
                    className={`border-2 rounded-lg sm:rounded-xl transition-all duration-300 ${
                      isExpenseExpanded
                        ? "bg-green-700/10 border-none shadow-lg shadow-green-700/20"
                        : "bg-gray-900/50 border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    <div className="p-3 sm:p-4">
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base text-white font-medium truncate">
                            {index + 1}. {expense.name}
                          </p>
                          <p className="text-green-700 font-bold text-base sm:text-lg">₹{expense.amount}</p>
                        </div>
                        <button
                          onClick={() => toggleExpense(expense._id)}
                          className="text-white hover:text-green-400 text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0"
                        >
                          {isExpenseExpanded ? "Hide" : "Show"}
                        </button>
                      </div>

                      {isExpenseExpanded && (
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700">
                          {/* Paid By */}
                          <div className="mb-3">
                            <p className="text-gray-400 text-xs sm:text-sm mb-2">Paid by:</p>
                            <div className="space-y-1 ml-2 sm:ml-4">
                              {expense.paidBy.map((payer) => (
                                <p key={payer._id} className="text-white text-xs sm:text-sm">
                                  {payer.name} - <span className="text-green-700 font-semibold">₹{payer.amount}</span>
                                </p>
                              ))}
                            </div>
                          </div>

                          {/* Split Amongst */}
                          <div className="mb-3">
                            <p className="text-gray-400 text-xs sm:text-sm mb-2">Split amongst:</p>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 ml-2 sm:ml-4">
                              {expense.splitAmongst.map((participant) => (
                                <span
                                  key={participant._id}
                                  className="bg-gray-800 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-lg"
                                >
                                  {participant.name}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Admin Actions */}
                          {isAdmin && (
                            <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4">
                              <button
                                onClick={() => toggleEditExpenseForm(expense)}
                                className="flex-1 flex items-center justify-center gap-2 bg-yellow-500/70 text-black font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all duration-300 shadow-lg  text-sm sm:text-base active:scale-[0.98]"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => toggleDeleteExpenseForm(expense)}
                                className="flex-1 flex items-center justify-center gap-2 bg-red-500/70 text-white font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all duration-300 shadow-lg text-sm sm:text-base active:scale-[0.98]"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Edit Expense Form */}
      {isEditExpenseOpen && selectedExpense && (
        <Suspense fallback={<div className="text-center text-gray-500 mt-4">Loading...</div>}>
          <EditExpenseForm
            groupId={groupId}
            expense={selectedExpense}
            onClose={() => {
              toggleEditExpenseForm();
              if (onExpenseUpdated) onExpenseUpdated();
            }}
          />
        </Suspense>
      )}

      {/* Delete Expense Form */}
      {isDeleteExpenseOpen && selectedExpense && (
        <Suspense fallback={<div className="text-center text-gray-500 mt-4">Loading...</div>}>
          <DeleteExpenseForm
            groupId={groupId}
            expense={selectedExpense}
            onClose={() => {
              toggleDeleteExpenseForm();
              if (onExpenseUpdated) onExpenseUpdated();
            }}
          />
        </Suspense>
      )}

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
  );
};

export default ExpensesComponent;