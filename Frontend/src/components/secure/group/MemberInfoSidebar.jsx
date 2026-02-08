import React, { useState, useRef, useCallback, useEffect, Suspense, lazy } from "react";
import { X, UserPlus, UserMinus, Clock, ChevronLeft } from "lucide-react";
import useStore from "../../../store/useStore";

const RemoveMemberForm = lazy(() => import("../admin/removemember"));

const MemberInfoSidebar = ({ 
  isOpen, 
  onClose, 
  isDark, 
  member,
  currentUserId,
  isAdmin,
  groupId,
  friends = [],
  requests = [],
  onFriendRequestSent,
  balances = [],
  membersWithSpend = []
}) => {
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestMessage, setRequestMessage] = useState(null);
  const [isRemoveMemberOpen, setIsRemoveMemberOpen] = useState(false);
  const debounceTimerRef = useRef(null);

  // Get store action
  const { sendFriendRequestAsync } = useStore();

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  if (!member) return null;

  // Get the actual user ID from member object
  const getUserId = () => {
    return member.userId?._id || member._id;
  };

  // Check if a member is already a friend
  const isFriend = () => {
    if (!friends || friends.length === 0) return false;
    
    const userId = getUserId();
    return friends.some(friend => String(friend._id) === String(userId));
  };

  // Check if there's a pending request
  const hasPendingRequest = () => {
    if (!requests || requests.length === 0) return false;
    
    const userId = getUserId();
    
    return requests.some(request => {
      const requesterId = String(request.requester?._id || request.requester);
      const recipientId = String(request.recipient?._id || request.recipient);
      const userIdStr = String(userId);
      
      return (requesterId === userIdStr || recipientId === userIdStr) && 
             request.status === 'pending';
    });
  };

  // Check if member is current user
  const isCurrentUser = () => {
    if (!currentUserId) return false;
    
    const userId = getUserId();
    return String(userId) === String(currentUserId);
  };

  // Check if we should show add friend button
  const shouldShowAddButton = () => {
    if (!member.email || member.email === "No email" || member.email === "") {
      return false;
    }
    
    if (isCurrentUser()) {
      return false;
    }
    
    if (isFriend()) {
      return false;
    }
    
    if (hasPendingRequest()) {
      return false;
    }
    
    return true;
  };

  // Send friend request with debouncing
  const sendFriendRequest = async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      setSendingRequest(true);
      
      try {
        await sendFriendRequestAsync(member.email);
        
        setRequestMessage({ type: 'success', text: 'Friend request sent!' });
        
        if (onFriendRequestSent) onFriendRequestSent();
        
        setTimeout(() => {
          setRequestMessage(null);
        }, 3000);
        
      } catch (error) {
        setRequestMessage({ 
          type: 'error', 
          text: error.response?.data?.error || error.message || 'Failed to send request' 
        });
        
        setTimeout(() => {
          setRequestMessage(null);
        }, 5000);
      } finally {
        setSendingRequest(false);
      }
    }, 300);
  };

  // Get first letter of name for avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  // Toggle remove member form
  const toggleRemoveMemberForm = () => {
    setIsRemoveMemberOpen(!isRemoveMemberOpen);
  };

  // Handle successful member removal
  const handleRemoveSuccess = () => {
    setIsRemoveMemberOpen(false);
    onClose(); // Close the member info sidebar
  };

  // Get balance for this member
  const getBalance = () => {
    if (!balances || balances.length === 0) return 0;
    const balance = balances.find(b => b.name === member.name);
    return balance?.balance || 0;
  };

  // Get total spend for this member
  const getTotalSpend = () => {
    if (!membersWithSpend || membersWithSpend.length === 0) return 0;
    const memberData = membersWithSpend.find(m => m.name === member.name);
    return memberData?.totalSpend || 0;
  };

  const isSelf = isCurrentUser();
  const isAlreadyFriend = isFriend();
  const hasPending = hasPendingRequest();
  const showAddButton = shouldShowAddButton();
  const memberBalance = getBalance();
  const memberSpend = getTotalSpend();
  
  // Count how many buttons will be shown
  const buttonCount = [
    showAddButton,
    isAlreadyFriend && !isSelf,
    hasPending && !isSelf && !isAlreadyFriend,
    isAdmin && !isSelf
  ].filter(Boolean).length;

  return (
    <>
      {/* Sidebar */}
      <div
        className={`absolute top-0 right-0 h-[calc(100%-65px)] md:h-full w-full md:w-[500px] ${
          isDark ? "bg-dark-bg" : "bg-white"
        } md:border-l ${
          isDark ? "md:border-gray-700" : "md:border-gray-200"
        } shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b ${
            isDark ? "border-gray-700 bg-[#1f2329]" : "border-gray-200"
          } flex-shrink-0`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors duration-300 flex-shrink-0 ${
                  isDark
                    ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2
                className={`text-lg font-bold truncate ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Contact info
              </h2>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Member Info Section */}
          <div
            className={`flex flex-col items-center py-8 border-b ${
              isDark ? "border-gray-700 bg-gray-850" : "border-gray-200 bg-gray-50"
            }`}
          >
            {/* Member Avatar */}
            <div
              className={`flex items-center justify-center w-28 h-28 md:w-32 md:h-32 rounded-full font-bold text-4xl md:text-5xl ${
                isDark
                  ? "bg-[#1f2329] text-white"
                  : "bg-[#1f2329] text-white"
              } shadow-lg mb-4`}
            >
              {getInitial(member.name)}
            </div>

            {/* Member Name */}
            <h1
              className={`text-xl md:text-2xl font-bold mb-1 px-4 text-center ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {member.name}
            </h1>

            {/* Member Email */}
            {member.email && member.email !== "No email" && (
              <p
                className={`text-sm md:text-base ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {member.email}
              </p>
            )}
          </div>

          {/* Action Buttons Section - Only show if not viewing self */}
          {!isSelf && (
            <div className={`p-6 border-b ${
              isDark ? "bg-dark-bg border-gray-700" : "bg-white border-gray-200"
            }`}>
              <div className={`${
                buttonCount === 1 ? 'flex justify-center' : 'grid grid-cols-2 gap-4'
              }`}>
                {/* Add Friend Button */}
                {showAddButton && (
                  <button
                    onClick={sendFriendRequest}
                    disabled={sendingRequest}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDark
                        ? "hover:bg-dark-bg text-gray-400 hover:text-white"
                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-full ${
                        isDark ? "bg-gray-800" : "bg-gray-200"
                      }`}
                    >
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium">
                      {sendingRequest ? "Sending..." : "Add Friend"}
                    </span>
                  </button>
                )}

                {/* Already Friends Status */}
                {isAlreadyFriend && (
                  <div className={`flex flex-col items-center gap-2 p-4 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    <div
                      className={`p-3 rounded-full ${
                        isDark ? "bg-[#1f2329]" : "bg-gray-200"
                      }`}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium">
                      Already Friends
                    </span>
                  </div>
                )}

                {/* Pending Request Status */}
                {hasPending && !isAlreadyFriend && (
                  <div className={`flex flex-col items-center gap-2 p-4 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    <div
                      className={`p-3 rounded-full ${
                        isDark ? "bg-[#1f2329]" : "bg-gray-200"
                      }`}
                    >
                      <Clock className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium">
                      Request Pending
                    </span>
                  </div>
                )}

                {/* Remove from Group Button - Admin Only */}
                {isAdmin && (
                  <button
                    onClick={toggleRemoveMemberForm}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-colors ${
                      isDark
                        ? "hover:bg-dark-bg text-gray-400 hover:text-white"
                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <div className={`p-3 rounded-full ${
                      isDark ? "bg-[#1f2329]" : "bg-gray-200"
                    }`}>
                      <UserMinus className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium">Remove</span>
                  </button>
                )}
              </div>

              {/* Success/Error Message */}
              {requestMessage && (
                <div className={`mt-4 text-sm p-3 rounded-lg ${
                  requestMessage.type === 'success'
                    ? (isDark 
                        ? 'bg-green-700/10 text-green-700 border border-green-700/30' 
                        : 'bg-green-50 text-green-600 border border-green-200')
                    : (isDark 
                        ? 'bg-red-500/10 text-red-500 border border-red-500/30' 
                        : 'bg-red-50 text-red-600 border border-red-200')
                }`}>
                  {requestMessage.text}
                </div>
              )}
            </div>
          )}

          {/* Balance Section */}
          <div className={`member-info-balance px-6 py-5 ${
            isDark ? "bg-dark-bg" : "bg-white"
          }`}>
            <h3 className={`text-sm font-medium mb-4 ${
              isDark ? "text-gray-500" : "text-gray-600"
            }`}>
              Balance
            </h3>
            
            <div className={`p-4 rounded-xl border ${
              isDark 
                ? 'bg-dark-bg/50 border-gray-600' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="space-y-3">
                {/* Balance */}
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Balance
                  </span>
                  <span className={`font-bold text-lg ${
                    memberBalance >= 0 
                      ? (isDark ? 'text-green-700' : 'text-green-600') 
                      : 'text-red-500'
                  }`}>
                    ₹{Number(memberBalance).toFixed(2)}
                  </span>
                </div>

                {/* Divider */}
                <div className={`h-px ${
                  isDark ? 'bg-gray-600' : 'bg-gray-200'
                }`} />

                {/* Total Spend */}
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Total Spend
                  </span>
                  <span className={`font-semibold text-base ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    ₹{Number(memberSpend).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Balance explanation */}
            {memberBalance !== 0 && (
              <p className={`text-xs mt-3 ${
                isDark ? 'text-gray-500' : 'text-gray-500'
              }`}>
                {memberBalance > 0 
                  ? `${member.name} is owed ₹${Number(memberBalance).toFixed(2)}`
                  : `${member.name} owes ₹${Number(Math.abs(memberBalance)).toFixed(2)}`
                }
              </p>
            )}
          </div>
        </div>

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

      {/* Remove Member Form */}
      {isRemoveMemberOpen && member && (
        <Suspense fallback={
          <div className={`fixed inset-0 flex items-center justify-center z-[60] ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>Loading...</div>
        }>
          <RemoveMemberForm
            groupId={groupId}
            member={member}
            onClose={toggleRemoveMemberForm}
            onSuccess={handleRemoveSuccess}
            isDark={isDark}
          />
        </Suspense>
      )}
    </>
  );
};

export default MemberInfoSidebar;
