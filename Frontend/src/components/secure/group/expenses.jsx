import React, { useState, Suspense, lazy } from "react";
import { Receipt, ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react";

const EditExpenseForm = lazy(() => import("../admin/editexpense"));
const DeleteExpenseForm = lazy(() => import("../admin/deleteexpense"));

const ExpensesComponent = ({ expenses, isAdmin, groupId, onExpenseUpdated, isDark }) => {
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
    <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6  border transition-all duration-300 ${
      isDark 
        ? 'bg-gray-900 border-gray-800' 
        :'bg-gray-50 border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
            isDark ? 'bg-green-700/10' : 'bg-green-100'
          }`}>
            <Receipt className={`w-5 h-5 sm:w-6 sm:h-6 ${
              isDark ? 'text-green-700' : 'text-green-600'
            }`} />
          </div>
          <div className="min-w-0">
            <h3 className={`text-xl sm:text-2xl font-bold truncate ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Expenses</h3>
            <p className={`text-xs sm:text-sm mt-1 ${
              isDark ? 'text-gray-500' : 'text-gray-600'
            }`}>{expenses.length} expense(s) recorded</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-1 sm:gap-2 transition-colors duration-300 flex-shrink-0 ${
            isDark 
              ? 'text-green-700 hover:text-green-400' 
              : 'text-green-600 hover:text-green-700'
          }`}
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
            <div className={`text-center py-6 sm:py-8 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
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
                        ? isDark
                          ? "bg-green-700/10 border-none shadow-lg shadow-green-700/20"
                          : "bg-green-50 border-green-200 shadow-lg"
                        : isDark
                          ? "bg-gray-900/50 border-gray-800 hover:border-gray-700"
                          : "bg-gray-50 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="p-3 sm:p-4">
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm sm:text-base font-medium truncate ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {index + 1}. {expense.name}
                          </p>
                          <p className={`font-bold text-base sm:text-lg ${
                            isDark ? 'text-green-700' : 'text-green-600'
                          }`}>₹{expense.amount}</p>
                        </div>
                        <button
                          onClick={() => toggleExpense(expense._id)}
                          className={`text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                            isDark 
                              ? 'text-white hover:text-green-400' 
                              : 'text-gray-900 hover:text-green-600'
                          }`}
                        >
                          {isExpenseExpanded ? "Hide" : "Show"}
                        </button>
                      </div>

                      {isExpenseExpanded && (
                        <div className={`mt-3 sm:mt-4 pt-3 sm:pt-4 border-t ${
                          isDark ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                          {/* Paid By */}
                          <div className="mb-3">
                            <p className={`text-xs sm:text-sm mb-2 ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>Paid by:</p>
                            <div className="space-y-1 ml-2 sm:ml-4">
                              {expense.paidBy.map((payer) => (
                                <p key={payer._id} className={`text-xs sm:text-sm ${
                                  isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {payer.name} - <span className={`font-semibold ${
                                    isDark ? 'text-green-700' : 'text-green-600'
                                  }`}>₹{payer.amount}</span>
                                </p>
                              ))}
                            </div>
                          </div>

                          {/* Split Amongst */}
                          <div className="mb-3">
                            <p className={`text-xs sm:text-sm mb-2 ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>Split amongst:</p>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 ml-2 sm:ml-4">
                              {expense.splitAmongst.map((participant) => (
                                <span
                                  key={participant._id}
                                  className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-lg ${
                                    isDark 
                                      ? 'bg-gray-800 text-white' 
                                      : 'bg-gray-200 text-gray-900'
                                  }`}
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
                                className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all duration-300 shadow-lg text-sm sm:text-base active:scale-[0.98]"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => toggleDeleteExpenseForm(expense)}
                                className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all duration-300 shadow-lg text-sm sm:text-base active:scale-[0.98]"
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
        <Suspense fallback={<div className={`text-center mt-4 ${
          isDark ? 'text-gray-500' : 'text-gray-600'
        }`}>Loading...</div>}>
          <EditExpenseForm
            groupId={groupId}
            expense={selectedExpense}
            onClose={() => {
              toggleEditExpenseForm();
              if (onExpenseUpdated) onExpenseUpdated();
            }}
            isDark={isDark}
          />
        </Suspense>
      )}

      {/* Delete Expense Form */}
      {isDeleteExpenseOpen && selectedExpense && (
        <Suspense fallback={<div className={`text-center mt-4 ${
          isDark ? 'text-gray-500' : 'text-gray-600'
        }`}>Loading...</div>}>
          <DeleteExpenseForm
            groupId={groupId}
            expense={selectedExpense}
            onClose={() => {
              toggleDeleteExpenseForm();
              if (onExpenseUpdated) onExpenseUpdated();
            }}
            isDark={isDark}
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