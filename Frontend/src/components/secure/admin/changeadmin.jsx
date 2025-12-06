import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ShieldCheck, X, User, AlertCircle } from 'lucide-react';

const ChangeAdminForm = ({ groupId, onClose }) => {
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-800 w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 border-b border-gray-800 p-4 sm:p-5 md:p-6 flex items-center justify-between rounded-t-xl sm:rounded-t-2xl">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 bg-green-700/10 rounded-lg flex-shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white truncate">Change Admin</h2>
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
          <div className="p-3 sm:p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-yellow-500 min-w-0">
              <p className="font-semibold mb-1">Important!</p>
              <p className="leading-relaxed">Transferring admin rights will make you a regular member. This action cannot be undone.</p>
            </div>
          </div>

          {/* New Admin Name Input */}
          <div>
            <label className="text-gray-400 text-xs sm:text-sm mb-2 block flex items-center gap-2">
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
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-700 bg-gray-900/50 text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-green-700 transition-all duration-300 focus:shadow-lg focus:shadow-green-700/20"
            />
            <p className="text-gray-500 text-xs mt-2">
              Enter the exact name of the member who will become the new admin
            </p>
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
              onClick={handleEdit}
              disabled={loading}
              className="w-full sm:flex-1 bg-gradient-to-r from-green-700 to-green-600 hover:text-black  text-white font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.98]"
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