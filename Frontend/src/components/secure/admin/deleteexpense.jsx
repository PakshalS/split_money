import React, { useState } from 'react';
import { Trash2, X, AlertTriangle } from 'lucide-react';
import useStore from '../../../store/useStore';

const DeleteExpenseForm = ({ groupId, expense, onClose, isDark }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get store action
  const { deleteExpense } = useStore();

  const handleDeleteExpense = async () => {
    setLoading(true);
    setError('');

    try {
      await deleteExpense(groupId, expense._id);
      alert('Expense deleted successfully!');
      onClose();
    } catch (error) {
      console.error('Error deleting expense:', error);
      setError(error.message || 'Failed to delete expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-0 flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
      <div className={`rounded-xl sm:rounded-2xl shadow-2xl border w-full max-w-md ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800' 
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
      }`}>
        {/* Header */}
        <div className={`border-b p-4 sm:p-5 md:p-6 flex items-center justify-between rounded-t-xl sm:rounded-t-2xl ${
          isDark 
            ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800' 
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
              isDark ? 'bg-red-500/10' : 'bg-red-100'
            }`}>
              <Trash2 className={`w-5 h-5 sm:w-6 sm:h-6 ${
                isDark ? 'text-red-500' : 'text-red-600'
              }`} />
            </div>
            <h2 className={`text-xl sm:text-2xl font-bold truncate ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Delete Expense</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors duration-300 flex-shrink-0 ${
              isDark 
                ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Warning Message */}
          <div className={`p-3 sm:p-4 border rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3 ${
            isDark 
              ? 'bg-red-500/10 border-red-500/50' 
              : 'bg-red-50 border-red-300'
          }`}>
            <AlertTriangle className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5 ${
              isDark ? 'text-red-500' : 'text-red-600'
            }`} />
            <div className={`text-sm sm:text-base min-w-0 ${
              isDark ? 'text-red-400' : 'text-red-700'
            }`}>
              <p className="font-semibold mb-1 sm:mb-2">Warning!</p>
              <p className="leading-relaxed">Are you sure you want to delete this expense? This action cannot be undone.</p>
            </div>
          </div>

          {/* Expense Details */}
          <div className={`p-3 sm:p-4 border rounded-lg sm:rounded-xl space-y-2 ${
            isDark 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex justify-between items-start">
              <span className={`text-xs sm:text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Expense Name:</span>
              <span className={`font-semibold text-sm sm:text-base text-right truncate ml-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{expense.name}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className={`text-xs sm:text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Amount:</span>
              <span className={`font-bold text-sm sm:text-base ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>₹{expense.amount}</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`p-3 sm:p-4 border rounded-lg sm:rounded-xl text-center text-sm sm:text-base ${
              isDark 
                ? 'bg-red-500/10 border-red-500/50 text-red-500' 
                : 'bg-red-50 border-red-300 text-red-600'
            }`}>
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
            <button
              onClick={onClose}
              disabled={loading}
              className={`w-full sm:flex-1 font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base active:scale-[0.98] ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteExpense}
              disabled={loading}
              className={`w-full sm:flex-1 bg-gradient-to-r font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.98] ${
                isDark 
                  ? 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-red-500/50' 
                  : 'from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white hover:shadow-red-400/50'
              }`}
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              {loading ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteExpenseForm;