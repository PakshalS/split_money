import React, { useState } from "react";
import { Search, Trash2, User, AlertTriangle } from "lucide-react";
import useStore from "../../../store/useStore";

const FriendListComponent = ({ friends = [], onFriendRemoved, isDark }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [friendToDelete, setFriendToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { removeFriendAsync } = useStore();

  // Filter friends based on search
  const filteredFriends = friends.filter(
    (friend) =>
      friend.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to get initials
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!friendToDelete) return;
    
    setIsDeleting(true);
    try {
      await removeFriendAsync(friendToDelete._id);
      if (onFriendRemoved) onFriendRemoved();
      setFriendToDelete(null);
    } catch (error) {
      console.error("Failed to remove friend", error);
      // Optional: Add toast notification here
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm transition-colors ${
              isDark
                ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-500 focus:border-green-600 focus:ring-1 focus:ring-green-600'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500'
            } focus:outline-none`}
          />
        </div>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto -mx-2 px-2 scrollbar-hide">
        {filteredFriends.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 sm:h-60 text-center">
            <div className={`p-3 rounded-full mb-3 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <User className={`w-6 h-6 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            </div>
            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {searchTerm ? 'No friends found' : 'No friends yet'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredFriends.map((friend) => (
              <div
                key={friend._id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors group ${
                  isDark 
                    ? 'hover:bg-gray-800' 
                    : 'hover:bg-gray-50'
                }`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                }`}>
                  {getInitials(friend.name)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {friend.name}
                  </h3>
                  {friend.email && (
                    <p className={`text-xs truncate mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      {friend.email}
                    </p>
                  )}
                </div>

                {/* Delete Action (Visible on Hover) */}
                <button
                  onClick={() => setFriendToDelete(friend)}
                  className={`p-2 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all ${
                    isDark 
                      ? 'text-gray-500 hover:text-red-400 hover:bg-red-400/10' 
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                  title="Remove friend"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {friendToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-xs p-6 rounded-2xl shadow-2xl transform transition-all scale-100 ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-full mb-4 ${
                isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-500'
              }`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Remove Friend?
              </h3>
              
              <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Are you sure you want to remove <span className="font-semibold">{friendToDelete.name}</span>?
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setFriendToDelete(null)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isDark 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" /> Remove
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
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

export default FriendListComponent;