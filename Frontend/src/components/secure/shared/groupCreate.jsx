import { ArrowLeft, MoreVertical, SendIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Search, Plus, Check, X } from 'lucide-react';
import AddGuestModal from './addGuestModal';
import FriendsListSkeleton from './friendsloader';
import useStore from "../../../store/useStore";

const CreateGroupList = ({ isDark, onBack, onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [guests, setGuests] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);

  // Get from store (friends are cached globally now)
  const { 
    friends, 
    isLoadingFriends, 
    friendsError,
    fetchFriends: fetchFriendsFromStore, 
    createGroup: createGroupInStore 
  } = useStore();

  // Fetch friends ONCE on mount (empty dependency array)
  useEffect(() => {
    if (friends.length === 0) {
      fetchFriendsFromStore();
    }
  }, []);

  // Auto-refresh friends if empty after a short delay (indicates possible API error)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (friends.length === 0 && !isLoadingFriends) {
        console.log('Friends list empty after load, attempting refresh...');
        fetchFriendsFromStore();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [friends.length, isLoadingFriends]);

  const toggleFriendSelection = (friend) => {
    setSelectedFriends(prev => {
      const isSelected = prev.some(f => f._id === friend._id);
      if (isSelected) {
        return prev.filter(f => f._id !== friend._id);
      } else {
        return [...prev, friend];
      }
    });
  };

  const handleAddGuests = (newGuests) => {
    setGuests(prev => [...prev, ...newGuests]);
    // Auto-select all added guests
    setSelectedFriends(prev => [...prev, ...newGuests]);
  };

  const removeGuest = (guestId) => {
    setGuests(prev => prev.filter(guest => guest._id !== guestId));
    setSelectedFriends(prev => prev.filter(friend => friend._id !== guestId));
  };

  const createGroup = async () => {
    if (!groupName.trim()) {
      alert('Please enter a group name');
      return;
    }

    if (selectedFriends.length === 0) {
      alert('Please select at least one friend or guest');
      return;
    }

    setIsCreating(true);
    try {
      const payload = {
        name: groupName.trim(),
        members: selectedFriends.map(friend => ({
          name: friend.name,
          email: friend.email || '',
          isGuest: friend.isGuest || false
        }))
      };

      // Use store action - handles optimistic updates automatically
      const newGroup = await createGroupInStore(payload);

      onGroupCreated?.(newGroup);
      onBack?.();
    } catch (error) {
      console.error('Error creating group:', error);
      alert(error.message || 'Failed to create group');
    } finally {
      setIsCreating(false);
    }
  };

  // Combine friends and guests for display
  const allContacts = [...friends, ...guests];
  
  // Filter contacts based on search term
  const filteredContacts = allContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Show skeleton loader ONLY if loading AND no cached data
  if (isLoadingFriends && friends.length === 0) {
    return <FriendsListSkeleton isDark={isDark} />;
  }

  return (
    <div className={`h-full flex flex-col relative ${
      isDark 
        ? 'bg-dark-bg'
        : 'bg-gray-100'
    }`}>
      {/* Header with Close Button */}
      <div className={`p-4 border-b ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Create New Group
          </h2>
          <button
            onClick={onBack}
            className={`p-2 rounded-full transition-colors ${
              isDark 
                ? 'hover:bg-gray-700 text-gray-400' 
                : 'hover:bg-gray-200 text-gray-600'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Group Name Input */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border ${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500'
          } focus:outline-none focus:ring-1 focus:ring-green-500`}
        />
      </div>

      {/* Search Friends with Menu */}
      <div className="px-4 pb-4">
        <div className="relative flex space-x-2">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search friends and guests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500'
              } focus:outline-none focus:ring-1 focus:ring-green-500`}
            />
          </div>
          
          {/* Three dots menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`p-3 rounded-lg border transition-colors ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600' 
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {/* Dropdown menu */}
            {showMenu && (
              <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10 ${
                isDark ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
              }`}>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowGuestModal(true);
                      setShowMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      isDark 
                        ? 'text-gray-200 hover:bg-gray-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Add Guest
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Friends Count */}
      {selectedFriends.length > 0 && (
        <div className="px-4 pb-2">
          <span className={`text-sm ${
            isDark ? 'text-green-400' : 'text-green-600'
          }`}>
            {selectedFriends.length} member{selectedFriends.length !== 1 ? 's' : ''} selected
          </span>
        </div>
      )}

      {/* Friends and Guests List - Scrollable without scrollbar */}
      <div className="flex-1 overflow-y-auto scrollbar-hide" style={{
        scrollbarWidth: 'none', /* Firefox */
        msOverflowStyle: 'none', /* IE and Edge */
      }}>
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
        `}</style>
        
        {filteredContacts.map((contact) => {
          const isSelected = selectedFriends.some(f => f._id === contact._id);
          const isGuest = contact.isGuest;
          
          return (
            <div
              key={contact._id}
              className={`p-4 border-b transition-colors ${
                isSelected
                  ? (isDark ? 'bg-green-800/20 border-gray-600' : 'bg-green-50 border-green-100')
                  : (isDark ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-gray-50 border-gray-100')
              }`}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="cursor-pointer flex-1 flex items-center space-x-3"
                  onClick={() => toggleFriendSelection(contact)}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold ${
                    isGuest 
                      ? (isDark ? 'bg-blue-700 text-blue-300' : 'bg-blue-200 text-blue-700')
                      : (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')
                  }`}>
                    {contact.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {contact.name}
                      </h3>
                      {isGuest && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isDark ? 'bg-blue-800 text-blue-300' : 'bg-blue-100 text-blue-600'
                        }`}>
                          Guest
                        </span>
                      )}
                    </div>
                    <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {contact.email || 'No email'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Remove guest button */}
                  {isGuest && (
                    <button
                      onClick={() => removeGuest(contact._id)}
                      className={`p-1 rounded-full transition-colors ${
                        isDark 
                          ? 'hover:bg-gray-600 text-red-400' 
                          : 'hover:bg-gray-200 text-red-500'
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {filteredContacts.length === 0 && (
          <div className="p-8 text-center">
            {searchTerm ? (
              <>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  No contacts found matching "{searchTerm}"
                </p>
              </>
            ) : friendsError ? (
              <>
                <p className={`text-sm font-medium mb-4 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                  Error loading friends
                </p>
                <p className={`text-xs mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {friendsError}
                </p>
                <button
                  onClick={() => fetchFriendsFromStore()}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDark 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  Retry
                </button>
              </>
            ) : (
              <>
                <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  No friends yet
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Add friends to include them in groups
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Create Group Floating Action Button */}
      <button
        onClick={createGroup}
        disabled={isCreating || !groupName.trim() || selectedFriends.length === 0}
        className={`absolute bottom-6 right-6 p-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 z-10 ${
          isCreating || !groupName.trim() || selectedFriends.length === 0
            ? (isDark 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed')
            : (isDark
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/30 hover:shadow-green-600/50' 
                : 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/30 hover:shadow-green-500/50')
        }`}
      >
        {isCreating ? (
          <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <SendIcon className="w-6 h-6" />
        )}
      </button>

      {/* Add Guest Modal */}
      <AddGuestModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        onAddGuests={handleAddGuests}
        isDark={isDark}
      />

      {/* Close menu when clicking outside */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default CreateGroupList;