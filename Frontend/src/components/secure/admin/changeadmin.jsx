import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ShieldCheck, X, User, AlertCircle } from 'lucide-react';

const ChangeAdminForm = ({ groupId, onClose, isDark }) => {
  const [newAdminName, setNewAdminName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEdit = async () => {
    if (!newAdminName.trim()) {
      setError('Please enter a new admin name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = Cookies.get('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      await axios.put(
        `https://split-money-api.vercel.app/groups/${groupId}/transfer-admin`,
        {
          groupId,
          newAdminName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Transfer admin rights successfully!');
      onClose();
    } catch (error) {
      console.error('Error changing admin', error);
      setError(error.response?.data?.error || 'Failed to change admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-0  flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
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
              isDark ? 'bg-green-700/10' : 'bg-green-100'
            }`}>
              <ShieldCheck className={`w-5 h-5 sm:w-6 sm:h-6 ${
                isDark ? 'text-green-700' : 'text-green-600'
              }`} />
            </div>
            <h2 className={`text-xl sm:text-2xl font-bold truncate ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Change Admin</h2>
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
              ? 'bg-yellow-500/10 border-yellow-500/50' 
              : 'bg-yellow-50 border-yellow-300'
          }`}>
            <AlertCircle className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 ${
              isDark ? 'text-yellow-500' : 'text-yellow-600'
            }`} />
            <div className={`text-xs sm:text-sm min-w-0 ${
              isDark ? 'text-yellow-500' : 'text-yellow-700'
            }`}>
              <p className="font-semibold mb-1">Important!</p>
              <p className="leading-relaxed">Transferring admin rights will make you a regular member. This action cannot be undone.</p>
            </div>
          </div>

          {/* New Admin Name Input */}
          <div>
            <label className={`text-xs sm:text-sm mb-2 flex items-center gap-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              New Admin Name
            </label>
            <input
              type="text"
              placeholder="Enter member name"
              value={newAdminName}
              onChange={(e) => {
                setNewAdminName(e.target.value);
                setError('');
              }}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 text-sm sm:text-base focus:outline-none transition-all duration-300 focus:shadow-lg ${
                isDark 
                  ? 'border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:border-green-700 focus:shadow-green-700/20' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:shadow-green-500/20'
              }`}
            />
            <p className={`text-xs mt-2 ${
              isDark ? 'text-gray-500' : 'text-gray-500'
            }`}>
              Enter the exact name of the member who will become the new admin
            </p>
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
              onClick={handleEdit}
              disabled={loading}
              className={`w-full sm:flex-1 bg-gradient-to-r font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.98] ${
                isDark 
                  ? 'from-green-700 to-green-600 text-white hover:text-black' 
                  : 'from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600'
              }`}
            >
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              {loading ? 'Transferring...' : 'Transfer Admin'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeAdminForm;