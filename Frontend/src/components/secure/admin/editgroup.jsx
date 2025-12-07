import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Edit, X, Trash2, Save } from 'lucide-react';

const GroupEditForm = ({ groupId, onClose, setIsDeleted, isDark }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEdit = async () => {
    if (!name.trim()) {
      setError('Please enter a group name');
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
        `https://split-money-api.vercel.app/groups/${groupId}/edit`,
        {
          groupId,
          name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Edited successfully!');
      onClose();
    } catch (error) {
      console.error('Error editing group', error);
      setError(error.response?.data?.error || 'Failed to edit group');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = Cookies.get('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      if (window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
        setLoading(true);
        await axios.delete(`https://split-money-api.vercel.app/groups/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsDeleted(true);
        alert('Deleted successfully!');
        onClose();
        navigate('/home');
      }
    } catch (error) {
      console.error('Error deleting group', error);
      setError(error.response?.data?.error || 'Failed to delete group');
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
              isDark ? 'bg-green-700/10' : 'bg-green-100'
            }`}>
              <Edit className={`w-5 h-5 sm:w-6 sm:h-6 ${
                isDark ? 'text-green-700' : 'text-green-600'
              }`} />
            </div>
            <h2 className={`text-xl sm:text-2xl font-bold truncate ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Edit Group</h2>
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
          {/* Group Name Input */}
          <div>
            <label className={`text-xs sm:text-sm mb-2 block ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Group Name</label>
            <input
              type="text"
              placeholder="Enter new group name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 text-sm sm:text-base focus:outline-none transition-all duration-300 focus:shadow-lg ${
                isDark 
                  ? 'border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:border-green-700 focus:shadow-green-700/20' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:shadow-green-500/20'
              }`}
            />
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
            {/* Save Button */}
            <button
              onClick={handleEdit}
              disabled={loading}
              className={`w-full bg-gradient-to-r font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.98] ${
                isDark 
                  ? 'from-green-700 to-green-600 text-white hover:text-black' 
                  : 'from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600'
              }`}
            >
              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              disabled={loading}
              className={`w-full bg-gradient-to-r font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.98] ${
                isDark 
                  ? 'from-red-500 to-red-600 text-white hover:text-black' 
                  : 'from-red-400 to-red-500 text-white hover:from-red-500 hover:to-red-600'
              }`}
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              {loading ? 'Deleting...' : 'Delete Group'}
            </button>

            {/* Cancel Button */}
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

export default GroupEditForm;