import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import useStore from '../../../store/useStore';

const DeleteGroupForm = ({ groupId, onClose, setIsDeleted, isDark }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get store actions
  const { deleteGroup } = useStore();

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError('');
      await deleteGroup(groupId);
      setIsDeleted(true);
      onClose();
      navigate('/home');
    } catch (error) {
      console.error('Error deleting group', error);
      setError(error.message || 'Failed to delete group');
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
              isDark ? 'bg-red-600/10' : 'bg-red-100'
            }`}>
              <Trash2 className={`w-5 h-5 sm:w-6 sm:h-6 ${
                isDark ? 'text-red-500' : 'text-red-600'
              }`} />
            </div>
            <h2 className={`text-xl sm:text-2xl font-bold truncate ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Delete Group</h2>
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
          <div className={`p-4 rounded-lg sm:rounded-xl border flex items-start gap-3 ${
            isDark 
              ? 'bg-red-500/10 border-red-500/40' 
              : 'bg-red-50 border-red-300'
          }`}>
            <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
              isDark ? 'text-red-400' : 'text-red-600'
            }`} />
            <div className={`text-sm ${isDark ? 'text-red-300' : 'text-red-700'}`}>
              <p className="font-semibold mb-1">This action is permanent.</p>
              <p>Deleting this group will remove all expenses and history. This cannot be undone.</p>
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
          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={handleDelete}
              disabled={loading}
              className={`w-full bg-gradient-to-r font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.98] ${
                isDark 
                  ? 'from-red-500 to-red-600 text-white hover:text-black' 
                  : 'from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
              }`}
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              {loading ? 'Deleting...' : 'Delete Group'}
            </button>

            <button
              onClick={onClose}
              disabled={loading}
              className={`w-full font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base active:scale-[0.98] ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteGroupForm;