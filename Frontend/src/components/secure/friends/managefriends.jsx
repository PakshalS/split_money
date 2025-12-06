import React, { useState, useCallback, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Users, Trash2 } from "lucide-react";
import { useDebounce } from "./debounce"; // Import the hook

const FriendListComponent = ({ friends, onFriendRemoved }) => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceTimerRef = useRef(null);

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const token = Cookies.get("authToken");

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (friend.email && friend.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
  );

  const removeFriend = useCallback(async (friendId) => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce the API call
    debounceTimerRef.current = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        await axios.delete(`https://split-money-api.vercel.app/friends/${friendId}/remove`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSelectedFriend(null);
        if (onFriendRemoved) onFriendRemoved();
      } catch (error) {
        setError(error.response?.data?.error || "Failed to remove friend");
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [token, onFriendRemoved]);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-5 shadow-2xl border border-gray-800 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
        <div className="p-1.5 sm:p-2 bg-green-700/10 rounded-lg flex-shrink-0">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl sm:text-2xl font-bold text-white truncate">Your Friends</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {friends.length === 0 ? "No friends yet" : `${friends.length} friend(s)`}
          </p>
        </div>
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search friends..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 sm:p-4 mb-3 sm:mb-4 rounded-lg sm:rounded-xl border-2 border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:border-green-700 transition-all duration-300 focus:shadow-lg focus:shadow-green-700/20 text-sm sm:text-base"
      />

      {/* Error Message */}
      {error && (
        <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-500/10 border border-red-500/50 rounded-lg sm:rounded-xl text-red-500 text-center text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* Friends List */}
      {friends.length === 0 ? (
        <div className="text-center py-8 sm:py-12 text-gray-500">
          <Users className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 opacity-30" />
          <p className="text-base sm:text-lg">No friends yet</p>
          <p className="text-xs sm:text-sm mt-2">Send requests to connect with friends</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[300px] sm:max-h-[157px] overflow-y-auto scrollbar-hide">
          {filteredFriends.map((friend) => {
            const isSelected = selectedFriend === friend._id;
            return (
              <div
                key={friend._id}
                className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${
                  isSelected
                    ? "bg-red-500/10 border-red-500 shadow-lg shadow-red-500/20"
                    : "bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:bg-gray-900"
                }`}
              >
                <div
                  className="flex justify-between items-center cursor-pointer gap-2"
                  onClick={() => setSelectedFriend(isSelected ? null : friend._id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base text-white font-medium truncate">{friend.name}</p>
                    {friend.email && (
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{friend.email}</p>
                    )}
                  </div>
                  <span className="text-green-700 text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0">
                    {isSelected ? "Close" : "Options"}
                  </span>
                </div>

                {isSelected && (
                  <div className="mt-3 sm:mt-4">
                    <button
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base active:scale-[0.98]"
                      onClick={() => removeFriend(friend._id)}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      {loading ? "Removing..." : "Remove Friend"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {filteredFriends.length === 0 && (
            <div className="text-center py-6 sm:py-8 text-gray-500 text-xs sm:text-sm">
              No friends found matching "{searchTerm}"
            </div>
          )}
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