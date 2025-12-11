import React, { useState, Suspense, lazy, useRef, useCallback } from "react";
import { Users, ChevronDown, ChevronUp, UserMinus, UserPlus, Clock } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

const RemoveMemberForm = lazy(() => import("../admin/removemember"));

const MembersComponent = ({ 
  members, 
  isAdmin, 
  groupId, 
  onMemberRemoved, 
  isDark,
  friends = [],
  requests = [], // Add requests prop
  onFriendRequestSent,
  currentUserId
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRemoveMemberOpen, setIsRemoveMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [sendingRequestTo, setSendingRequestTo] = useState(null);
  const [requestMessages, setRequestMessages] = useState({});
  const debounceTimerRef = useRef(null);

  const toggleRemoveMemberForm = (member) => {
    setSelectedMember(member);
    setIsRemoveMemberOpen(!isRemoveMemberOpen);
  };

  // Get the actual user ID from member object
  const getUserId = useCallback((member) => {
    // If member has userId object, use that, otherwise use member._id
    return member.userId?._id || member._id;
  }, []);

  // Check if a member is already a friend
  const isFriend = useCallback((member) => {
    if (!friends || friends.length === 0) return false;
    
    const userId = getUserId(member);
    return friends.some(friend => String(friend._id) === String(userId));
  }, [friends, getUserId]);

  // Check if there's a pending request (sent or received)
  const hasPendingRequest = useCallback((member) => {
    if (!requests || requests.length === 0) return false;
    
    const userId = getUserId(member);
    
    return requests.some(request => {
      const requesterId = String(request.requester?._id || request.requester);
      const recipientId = String(request.recipient?._id || request.recipient);
      const userIdStr = String(userId);
      
      // Check if this user is either the requester or recipient
      return (requesterId === userIdStr || recipientId === userIdStr) && 
             request.status === 'pending';
    });
  }, [requests, getUserId]);

  // Check if member is current user
  const isCurrentUser = useCallback((member) => {
    if (!currentUserId) return false;
    
    const userId = getUserId(member);
    return String(userId) === String(currentUserId);
  }, [currentUserId, getUserId]);

  // Check if we should show add friend button
  const shouldShowAddButton = useCallback((member) => {
    // No email = no button
    if (!member.email || member.email === "No email" || member.email === "") {
      return false;
    }
    
    // If it's the current user = no button
    if (isCurrentUser(member)) {
      return false;
    }
    
    // If already a friend = no button
    if (isFriend(member)) {
      return false;
    }
    
    // If there's a pending request = no button
    if (hasPendingRequest(member)) {
      return false;
    }
    
    // Otherwise = show button!
    return true;
  }, [isFriend, isCurrentUser, hasPendingRequest]);

  // Send friend request with debouncing
  const sendFriendRequest = useCallback(async (memberEmail, memberId) => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debouncing
    debounceTimerRef.current = setTimeout(async () => {
      const token = Cookies.get("authToken");
      if (!token) {
        setRequestMessages(prev => ({
          ...prev,
          [memberId]: { type: 'error', text: 'No auth token found' }
        }));
        return;
      }

      setSendingRequestTo(memberId);
      
      try {
        await axios.post(
          "https://split-money-api.vercel.app/friends/send",
          { email: memberEmail },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setRequestMessages(prev => ({
          ...prev,
          [memberId]: { type: 'success', text: 'Friend request sent!' }
        }));
        
        if (onFriendRequestSent) onFriendRequestSent();
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setRequestMessages(prev => {
            const newMessages = { ...prev };
            delete newMessages[memberId];
            return newMessages;
          });
        }, 3000);
        
      } catch (error) {
        setRequestMessages(prev => ({
          ...prev,
          [memberId]: { 
            type: 'error', 
            text: error.response?.data?.error || 'Failed to send request' 
          }
        }));
        
        // Clear error after 5 seconds
        setTimeout(() => {
          setRequestMessages(prev => {
            const newMessages = { ...prev };
            delete newMessages[memberId];
            return newMessages;
          });
        }, 5000);
      } finally {
        setSendingRequestTo(null);
      }
    }, 300);
  }, [onFriendRequestSent]);

  return (
    <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border transition-all duration-300 ${
      isDark 
        ? 'bg-gray-900 border-gray-800' 
        :'bg-gray-50 border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
            isDark ? 'bg-green-700/10' : 'bg-green-100'
          }`}>
            <Users className={`w-5 h-5 sm:w-6 sm:h-6 ${
              isDark ? 'text-green-700' : 'text-green-600'
            }`} />
          </div>
          <div className="min-w-0">
            <h3 className={`text-xl sm:text-2xl font-bold truncate ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Members</h3>
            <p className={`text-xs sm:text-sm mt-1 ${
              isDark ? 'text-gray-500' : 'text-gray-600'
            }`}>{members.length} member(s)</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-1 sm:gap-2 transition-colors duration-300 flex-shrink-0 ${
            isDark 
              ? 'text-green-700 hover:text-green-400' 
              : 'text-green-600 hover:text-green-700'
          }`}
        >
          {isExpanded ? (
            <>
              <span className="text-xs sm:text-sm font-medium">Hide</span>
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </>
          ) : (
            <>
              <span className="text-xs sm:text-sm font-medium">Show</span>
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
            </>
          )}
        </button>
      </div>

      {/* Members List */}
      {isExpanded && (
        <div className={`space-y-2 ${members.length > 3 ? 'max-h-[250px] sm:max-h-[300px] overflow-y-auto scrollbar-hide' : ''}`}>
          {members.map((member, index) => {
            const isSelf = isCurrentUser(member);
            const isAlreadyFriend = isFriend(member);
            const hasPending = hasPendingRequest(member);
            const showAddButton = shouldShowAddButton(member);
            const message = requestMessages[member._id];

            return (
              <div
                key={member._id || index}
                className={`border-2 p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 ${
                  isDark 
                    ? 'bg-gray-900/50 border-gray-800 hover:border-gray-700' 
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm sm:text-base font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {index + 1}. {member.name}
                      </p>
                      {isSelf && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          isDark 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          You
                        </span>
                      )}
                      {isAlreadyFriend && !isSelf && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          isDark 
                            ? 'bg-green-700/20 text-green-700' 
                            : 'bg-green-100 text-green-600'
                        }`}>
                          Friend
                        </span>
                      )}
                      {hasPending && !isSelf && !isAlreadyFriend && (
                        <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isDark 
                            ? 'bg-yellow-500/20 text-yellow-500' 
                            : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </div>
                    <p className={`text-xs sm:text-sm truncate mt-1 ${
                      isDark ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      {member.email || "No email"}
                    </p>
                    
                    {/* Inline message for this member */}
                    {message && (
                      <div className={`mt-2 text-xs p-2 rounded-md ${
                        message.type === 'success'
                          ? (isDark 
                              ? 'bg-green-700/10 text-green-700 border border-green-700/30' 
                              : 'bg-green-50 text-green-600 border border-green-200')
                          : (isDark 
                              ? 'bg-red-500/10 text-red-500 border border-red-500/30' 
                              : 'bg-red-50 text-red-600 border border-red-200')
                      }`}>
                        {message.text}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Add Friend Button - only show if conditions are met */}
                    {showAddButton && (
                      <button
                        onClick={() => sendFriendRequest(member.email, member._id)}
                        disabled={sendingRequestTo === member._id}
                        className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-300 shadow-md text-xs sm:text-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                          isDark
                            ? 'bg-green-700 hover:bg-green-600 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">
                          {sendingRequestTo === member._id ? "Sending..." : "Add"}
                        </span>
                      </button>
                    )}

                    {/* Remove Button (Admin only) */}
                    {isAdmin && (
                      <button
                        onClick={() => toggleRemoveMemberForm(member)}
                        className="flex items-center gap-1.5 sm:gap-2 bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-300 shadow-lg text-xs sm:text-sm active:scale-[0.98]"
                      >
                        <UserMinus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">Remove</span>
                        <span className="xs:hidden">×</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Remove Member Form */}
      {isRemoveMemberOpen && selectedMember && (
        <Suspense fallback={
          <div className={`text-center mt-4 ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>Loading...</div>
        }>
          <RemoveMemberForm
            groupId={groupId}
            member={selectedMember}
            onClose={() => {
              toggleRemoveMemberForm();
              if (onMemberRemoved) onMemberRemoved();
            }}
          />
        </Suspense>
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

export default MembersComponent;