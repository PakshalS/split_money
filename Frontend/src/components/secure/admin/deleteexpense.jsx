// import axios from 'axios';
// import Cookies from 'js-cookie';

// const DeleteExpenseForm = ({ groupId, expense, onClose }) => {

//   const handleDeleteExpense = async () => {
//     try {
//       const token = Cookies.get('authToken');
//       if (!token) {
//         console.error('No auth token found');
//         return;
//       }

//       await axios.delete(`https://split-money-api.vercel.app/groups/${groupId}/expenses/${expense._id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       alert('Expense deleted successfully!');
//       onClose();
//     } catch (error) {
//       console.error('Error deleting expense:', error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//       <div className="bg-gray-800 p-6 rounded-md shadow-md w-96 relative">
//         <button onClick={onClose} className="absolute top-2 right-2 text-white">&times;</button>
//         <h2 className="text-xl font-bold mb-4 text-white">Are you sure you want delete ?</h2>
//         <button onClick={handleDeleteExpense} className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700">Yes</button>
//       </div>
//     </div>
//   );
// };

// export default DeleteExpenseForm;
import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Trash2, X, AlertTriangle } from 'lucide-react';

const DeleteExpenseForm = ({ groupId, expense, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDeleteExpense = async () => {
    setLoading(true);
    setError('');

    try {
      const token = Cookies.get('authToken');
      if (!token) {
        console.error('No auth token found');
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      await axios.delete(`https://split-money-api.vercel.app/groups/${groupId}/expenses/${expense._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Expense deleted successfully!');
      onClose();
    } catch (error) {
      console.error('Error deleting expense:', error);
      setError(error.response?.data?.error || 'Failed to delete expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-800 w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 border-b border-gray-800 p-4 sm:p-5 md:p-6 flex items-center justify-between rounded-t-xl sm:rounded-t-2xl">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 bg-red-500/10 rounded-lg flex-shrink-0">
              <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white truncate">Delete Expense</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg transition-colors duration-300 flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Warning Message */}
          <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/50 rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm sm:text-base text-red-400 min-w-0">
              <p className="font-semibold mb-1 sm:mb-2">Warning!</p>
              <p className="leading-relaxed">Are you sure you want to delete this expense? This action cannot be undone.</p>
            </div>
          </div>

          {/* Expense Details */}
          <div className="p-3 sm:p-4 bg-gray-800/50 border border-gray-700 rounded-lg sm:rounded-xl space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-gray-400 text-xs sm:text-sm">Expense Name:</span>
              <span className="text-white font-semibold text-sm sm:text-base text-right truncate ml-2">{expense.name}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-400 text-xs sm:text-sm">Amount:</span>
              <span className="text-white font-bold text-sm sm:text-base">₹{expense.amount}</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/50 rounded-lg sm:rounded-xl text-red-500 text-center text-sm sm:text-base">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full sm:flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteExpense}
              disabled={loading}
              className="w-full sm:flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-500/50 flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.98]"
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