import React, { useState, useEffect } from "react";
import { Search, Plus, LogIn } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import GroupListSkeleton from "./grouplistloader";
import JoinGroupForm from "./JoinGroupForm";
import useStore from "../../../store/useStore";

const GroupList = ({ isDark, onFabClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isJoinFormOpen, setIsJoinFormOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentGroupId = location.pathname.split('/groups/')[1] || null;

  // Get groups from Zustand store
  const { groups, isLoadingGroups, fetchGroups } = useStore();

  // Fetch groups on mount only (empty dependency array)
  useEffect(() => {
    if (groups.length === 0) {
      fetchGroups();
    }
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter groups locally (instant, no API calls)
  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // Format time for display
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / 36e5;

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const onGroupSelect = (group) => {
    navigate(`/groups/${group._id}`, { state: { groupName: group.name } });
  };

  // Show skeleton loader ONLY if loading AND no cached data
  if (isLoadingGroups && groups.length === 0) {
    return (
      <div className="h-full relative">
        <GroupListSkeleton isDark={isDark} />
        <button
          onClick={() => setIsJoinFormOpen(true)}
          className={`absolute bottom-20 right-6 p-2.5 rounded-full flex items-center justify-center font-medium transition-all duration-300 shadow-md active:scale-95 z-10 ${
            isDark
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          <LogIn className="w-5 h-5" />
        </button>
        <button
          onClick={onFabClick}
          className={`absolute bottom-6 right-6 p-2.5 rounded-full flex items-center justify-center font-medium transition-all duration-300 shadow-md active:scale-95 z-10 ${
            isDark
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // If join form is open, render it instead
  if (isJoinFormOpen) {
    return (
      <JoinGroupForm
        isDark={isDark}
        onBack={() => setIsJoinFormOpen(false)}
      />
    );
  }

  return (
    <div className={`h-full flex flex-col relative ${
              isDark
                ? 'bg-dark-bg'
                : 'bg-gray-100'
            }`}>
      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500'
            } focus:outline-none focus:ring-1 focus:ring-green-500`}
          />
        </div>
      </div>

      {/* Group List - Scrollable without scrollbar */}
      <div className="flex-1 overflow-y-auto scrollbar-hide" style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {filteredGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className={`text-4xl mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              👥
            </div>
            <p className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {searchTerm ? 'No groups found' : 'No groups yet'}
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {searchTerm 
                ? `No groups matching "${searchTerm}"`
                : 'Create a group to start splitting expenses'
              }
            </p>
          </div>
        ) : (
          filteredGroups.map((group, index) => (
            <div
              key={group._id}
              onClick={() => onGroupSelect(group)}
              className={`p-4 border-b cursor-pointer transition-colors ${index === 0 ? 'newly-created-group-item' : ''} ${
                currentGroupId === group._id
                  ? (isDark ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-100')
                  : (isDark ? 'hover:bg-[#1f2329] border-gray-700' : 'hover:bg-gray-50 border-gray-100')
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold ${
                  isDark ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'
                }`}>
                  {group.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {group.name}
                    </h3>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatTime(group.createdAt)}
                    </span>
                  </div>
                  <p className={`text-sm truncate mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {group.members?.length || 0} member{group.members?.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Join Group FAB (Above Create FAB) */}
      <button
        onClick={() => setIsJoinFormOpen(true)}
        className={`absolute bottom-20 right-6 p-2.5 rounded-full flex items-center justify-center font-medium transition-all duration-300 shadow-md active:scale-95 z-10 ${
          isDark
              ? 'bg-[#1f2329] hover:bg-dark-bg text-white'
              : 'bg-dark-bg hover:bg-[#1f2329] text-white'
        }`}
      >
        <LogIn className="w-5 h-5" />
      </button>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={onFabClick}
        className={`create-group-fab absolute bottom-6 right-6 p-2.5 rounded-full flex items-center justify-center font-medium transition-all duration-300 shadow-md active:scale-95 z-10 ${
          isDark
              ? 'bg-[#1f2329] hover:bg-dark-bg text-white'
              : 'bg-dark-bg hover:bg-[#1f2329] text-white'
        }`}
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};

export default GroupList;