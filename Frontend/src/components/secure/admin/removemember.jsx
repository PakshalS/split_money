import React, { useState } from 'react';
import { UserMinus, X, AlertTriangle } from 'lucide-react';
import useStore from '../../../store/useStore';

const RemoveMemberForm = ({ groupId, member, onClose, onSuccess, isDark }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get store action
  const { removeMember } = useStore();

  const handleRemoveMember = async () => {
    setLoading(true);
    setError('');

    try {
      await removeMember(groupId, member.name);
      alert('Member removed successfully!');
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error removing member:', error);
      setError(error.message || 'Failed to remove member');
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
              isDark ? 'bg-orange-500/10' : 'bg-orange-100'
            }`}>
              <UserMinus className={`w-5 h-5 sm:w-6 sm:h-6 ${
                isDark ? 'text-orange-500' : 'text-orange-600'
              }`} />
            </div>
            <h2 className={`text-xl sm:text-2xl font-bold truncate ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Remove Member</h2>
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
              ? 'bg-orange-500/10 border-orange-500/50' 
              : 'bg-orange-50 border-orange-300'
          }`}>
            <AlertTriangle className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5 ${
              isDark ? 'text-orange-500' : 'text-orange-600'
            }`} />
            <div className={`text-sm sm:text-base min-w-0 ${
              isDark ? 'text-orange-400' : 'text-orange-700'
            }`}>
              <p className="font-semibold mb-1 sm:mb-2">Warning!</p>
              <p className="leading-relaxed">Are you sure you want to remove this member from the group? This action cannot be undone.</p>
            </div>
          </div>

          {/* Member Details */}
          <div className={`p-3 sm:p-4 border rounded-lg sm:rounded-xl space-y-2 ${
            isDark 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex justify-between items-start">
              <span className={`text-xs sm:text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Member Name:</span>
              <span className={`font-semibold text-sm sm:text-base text-right truncate ml-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{member.name}</span>
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
              onClick={handleRemoveMember}
              disabled={loading}
              className={`w-full sm:flex-1 bg-gradient-to-r font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.98] ${
                isDark 
                  ? 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white hover:shadow-orange-500/50' 
                  : 'from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white hover:shadow-orange-400/50'
              }`}
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