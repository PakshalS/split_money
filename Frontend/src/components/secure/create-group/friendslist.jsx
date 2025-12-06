import React, { useState } from 'react';
import { Users, Check } from 'lucide-react';

const FriendsList = ({ friends, onFriendSelect, selectedEmails, message1, error1 }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (friend.email && friend.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 shadow-2xl border border-gray-800 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-700/10 rounded-lg">
          <Users className="w-6 h-6 text-green-700" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white">Your Friends</h3>
          <p className="text-sm text-gray-500 mt-1">Select friends to add to the group</p>
        </div>
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search friends..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-4 mb-4 rounded-xl border-2 border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:border-green-700 transition-all duration-300 focus:shadow-lg focus:shadow-green-700/20"
      />

      {/* Friends List */}
      {friends.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No friends yet</p>
          <p className="text-sm mt-2">Add friends to quickly create groups</p>
        </div>
      ) : (
        <div className="space-y-2 h-[280px] lg:h-[250px] overflow-y-auto scrollbar-hide">
          {filteredFriends.map((friend) => {
            const isSelected = selectedEmails.includes(friend.email);
            return (
              <div
                key={friend._id}
                onClick={() => onFriendSelect(friend)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'bg-green-700/10 border-green-700 shadow-lg shadow-green-700/20'
                    : 'bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:bg-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                      isSelected
                        ? 'bg-green-700 border-green-700'
                        : 'border-gray-700'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{friend.name}</p>
                    {friend.email && (
                      <p className="text-sm text-gray-500 truncate">{friend.email}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filteredFriends.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No friends found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      {message1 && (
        <div className="mt-4 p-4 bg-green-700/10 border border-green-700/50 rounded-xl text-green-700 text-center">
          {message1}
        </div>
      )}
      {error1 && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-center">
          {error1}
        </div>
      )}

      <style jsx>{`
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

export default FriendsList;