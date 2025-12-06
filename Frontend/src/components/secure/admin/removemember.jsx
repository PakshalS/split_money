import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { UserMinus, X, AlertTriangle } from 'lucide-react';

const RemoveMemberForm = ({ groupId, member, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRemoveMember = async () => {
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

      await axios.delete(`https://split-money-api.vercel.app/groups/${groupId}/${member.name}/remove-member`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Member removed successfully!');
      onClose();
    } catch (error) {
      console.error('Error removing member:', error);
      setError(error.response?.data?.error || 'Failed to remove member');
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
            <div className="p-1.5 sm:p-2 bg-orange-500/10 rounded-lg flex-shrink-0">
              <UserMinus className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white truncate">Remove Member</h2>
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
          <div className="p-3 sm:p-4 bg-orange-500/10 border border-orange-500/50 rounded-lg sm:rounded-xl flex items-start gap-2 sm:gap-3">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm sm:text-base text-orange-400 min-w-0">
              <p className="font-semibold mb-1 sm:mb-2">Warning!</p>
              <p className="leading-relaxed">Are you sure you want to remove this member from the group? This action cannot be undone.</p>
            </div>
          </div>

          {/* Member Details */}
          <div className="p-3 sm:p-4 bg-gray-800/50 border border-gray-700 rounded-lg sm:rounded-xl space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-gray-400 text-xs sm:text-sm">Member Name:</span>
              <span className="text-white font-semibold text-sm sm:text-base text-right truncate ml-2">{member.name}</span>
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
              onClick={handleRemoveMember}
              disabled={loading}
              className="w-full sm:flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-orange-500/50 flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.98]"
            >
              <UserMinus className="w-4 h-4 sm:w-5 sm:h-5" />
              {loading ? 'Removing...' : 'Yes, Remove'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveMemberForm;