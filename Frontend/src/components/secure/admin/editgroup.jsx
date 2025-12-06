import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Edit, X, Trash2, Save } from 'lucide-react';

const GroupEditForm = ({ groupId, onClose, setIsDeleted }) => {
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-800 w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 border-b border-gray-800 p-4 sm:p-5 md:p-6 flex items-center justify-between rounded-t-xl sm:rounded-t-2xl">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 bg-green-700/10 rounded-lg flex-shrink-0">
              <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white truncate">Edit Group</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg transition-colors duration-300 flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Group Name Input */}
          <div>
            <label className="text-gray-400 text-xs sm:text-sm mb-2 block">Group Name</label>
            <input
              type="text"
              placeholder="Enter new group name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-700 bg-gray-900/50 text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-green-700 transition-all duration-300 focus:shadow-lg focus:shadow-green-700/20"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/50 rounded-lg sm:rounded-xl text-red-500 text-center text-sm sm:text-base">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 sm:space-y-3">
            {/* Save Button */}
            <button
              onClick={handleEdit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-700 to-green-600 hover:text-black  text-white font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg  flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.98]"
            >
              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:text-black  text-white font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.98]"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              {loading ? 'Deleting...' : 'Delete Group'}
            </button>

            {/* Cancel Button */}
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base active:scale-[0.98]"
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