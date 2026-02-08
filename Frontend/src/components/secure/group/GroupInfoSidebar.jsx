import React, { useEffect, useState, useRef } from "react";
import { X, LogOut, HandCoins, ChevronDown, ChevronUp, UserPlus, Pencil, ShieldOff, Trash2, ShieldPlus, ShieldMinus, Share2, Copy, Check, Lock, LockOpen, CheckCircle, XCircle, Shield, MoreVertical } from "lucide-react";
import useStore from "../../../store/useStore";
import MemberInfoSidebar from "./MemberInfoSidebar";
import { updateStrictJoin, approveJoinRequest, rejectJoinRequest } from "../../../api/groups";

const GroupInfoSidebar = ({ 
  isOpen, 
  onClose, 
  isDark, 
  groupName,
  members = [],
  onLeave,
  currentUserId,
  admins = [],
  isAdmin = false,
  groupId,
  friends = [],
  requests = [],
  onFriendRequestSent,
  balances = [],
  membersWithSpend = [],
  summary = [],
  onSettleUp,
  onAddMember,
  onChangeAdmin,
  onAddAdmin,
  onRemoveAdmin,
  onDeleteGroup,
  joinCode = "",
  strictJoin = false,

  joinRequests = []
}) => {
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberInfo, setShowMemberInfo] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(groupName || "");
  const [nameError, setNameError] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [inviteLinkCopied, setInviteLinkCopied] = useState(false);
  const [isStrictJoinEnabled, setIsStrictJoinEnabled] = useState(strictJoin);
  const [isTogglingStrictJoin, setIsTogglingStrictJoin] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [requestsStates, setRequestsStates] = useState({});
  const [openMenuFor, setOpenMenuFor] = useState(null);
  const menuRef = useRef(null);

  const { updateGroup, fetchGroupDetails, addAdmin, removeAdmin } = useStore();
  
  const MEMBERS_PREVIEW_LIMIT = 6;
  const SUMMARY_PREVIEW_LIMIT = 4;

  useEffect(() => {
    if (!isEditingName) {
      setNameDraft(groupName || "");
      setNameError("");
    }
  }, [groupName, isEditingName]);

  useEffect(() => {
    setIsStrictJoinEnabled(strictJoin);
  }, [strictJoin]);

  // Handle strict join toggle
  const handleToggleStrictJoin = async () => {
    try {
      setIsTogglingStrictJoin(true);
      const newValue = !isStrictJoinEnabled;
      await updateStrictJoin(groupId, newValue);
      setIsStrictJoinEnabled(newValue);
      // Refresh group details to get updated data
      await fetchGroupDetails(groupId);
    } catch (error) {
      console.error("Error updating strict join:", error);
      alert("Failed to update strict join setting");
      setIsStrictJoinEnabled(!isStrictJoinEnabled); // Revert
    } finally {
      setIsTogglingStrictJoin(false);
    }
  };

  // Copy join code to clipboard
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(joinCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  // Approve join request
  const handleApproveRequest = async (requesterId) => {
    try {
      setRequestsStates(prev => ({ ...prev, [requesterId]: 'approving' }));
      await approveJoinRequest(groupId, requesterId);
      setRequestsStates(prev => ({ ...prev, [requesterId]: 'approved' }));
      // Refresh group details
      await fetchGroupDetails(groupId);
      setTimeout(() => {
        setRequestsStates(prev => {
          const newState = { ...prev };
          delete newState[requesterId];
          return newState;
        });
      }, 1500);
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Failed to approve request");
      setRequestsStates(prev => ({ ...prev, [requesterId]: null }));
    }
  };

  // Reject join request
  const handleRejectRequest = async (requesterId) => {
    try {
      setRequestsStates(prev => ({ ...prev, [requesterId]: 'rejecting' }));
      await rejectJoinRequest(groupId, requesterId);
      setRequestsStates(prev => ({ ...prev, [requesterId]: 'rejected' }));
      // Refresh group details
      await fetchGroupDetails(groupId);
      setTimeout(() => {
        setRequestsStates(prev => {
          const newState = { ...prev };
          delete newState[requesterId];
          return newState;
        });
      }, 1500);
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject request");
      setRequestsStates(prev => ({ ...prev, [requesterId]: null }));
    }
  };

  // Open member info
  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setShowMemberInfo(true);
  };

  const handleCloseMemberInfo = () => {
    setShowMemberInfo(false);
    setTimeout(() => setSelectedMember(null), 300);
  };

  // Get first letter of name for avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  // Get member display name (Handles "You")
  const getMemberName = (member) => {
    const mId = String(member._id || member.userId);
    const cId = String(currentUserId);
    
    if (mId === cId) {
      return "You";
    }
    return member.name || "Unknown";
  };

  // Robust check if member is group admin
  const isMemberAdmin = (member) => {
    if (!admins || admins.length === 0) {
      return false;
    }

    let memberId;
    if (member.userId && typeof member.userId === 'object' && member.userId._id) {
      memberId = String(member.userId._id).trim();
    } else if (member.userId && typeof member.userId === 'string') {
      memberId = String(member.userId).trim();
    } else if (member._id) {
      memberId = String(member._id).trim();
    }
    
    if (!memberId) {
      return false;
    }

    return admins.some((admin) => {
      if (admin && typeof admin === 'object' && admin._id) {
        return String(admin._id).trim() === memberId;
      }
      return String(admin).trim() === memberId;
    });
  };

  // Sort members: "You" first, then others
  const sortedMembers = [...members].sort((a, b) => {
    const aId = String(a._id || a.userId);
    const bId = String(b._id || b.userId);
    const cId = String(currentUserId);

    if (aId === cId) return -1;
    if (bId === cId) return 1;
    return 0;
  });

  const displayedMembers = showAllMembers 
    ? sortedMembers 
    : sortedMembers.slice(0, MEMBERS_PREVIEW_LIMIT);
  
  const hasMoreMembers = sortedMembers.length > MEMBERS_PREVIEW_LIMIT;

  const displayedSummary = isSummaryExpanded 
    ? summary 
    : summary.slice(0, SUMMARY_PREVIEW_LIMIT);

  const hasMoreSummary = summary.length > SUMMARY_PREVIEW_LIMIT;

  const handleStartEditName = () => {
    setIsEditingName(true);
    setNameError("");
  };

  // Logic to handle saving or reverting when clicking away (Blur)
  const handleFinishEditing = async () => {
    if (isSavingName) return;

    const trimmed = nameDraft.trim();

    // If empty or unchanged, revert and close
    if (!trimmed || trimmed === (groupName || "").trim()) {
      setNameDraft(groupName || "");
      setIsEditingName(false);
      setNameError("");
      return;
    }

    // If changed, save and close
    try {
      setIsSavingName(true);
      await updateGroup(groupId, { name: trimmed });
      setIsEditingName(false);
      setNameError("");
    } catch (error) {
      console.error("Error updating group name:", error);
      setNameError("Failed to update.");
    } finally {
      setIsSavingName(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.blur(); // Trigger blur to save
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setNameDraft(groupName || "");
      setIsEditingName(false);
    }
  };

  const handleCopyInviteLink = async () => {
    try {
      const inviteLink = `${window.location.origin}/group/join/${joinCode}`;
      await navigator.clipboard.writeText(inviteLink);
      setInviteLinkCopied(true);
      setTimeout(() => setInviteLinkCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleMakeAdmin = async (memberName) => {
    try {
      await addAdmin(groupId, memberName);
      setOpenMenuFor(null);
      await fetchGroupDetails(groupId);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to make admin');
    }
  };

  const handleRemoveAdmin = async (memberName) => {
    try {
      if (admins.length <= 1) {
        alert('Cannot remove: group must have at least one admin');
        return;
      }
      await removeAdmin(groupId, memberName);
      setOpenMenuFor(null);
      await fetchGroupDetails(groupId);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to remove admin');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuFor(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="hidden md:block absolute inset-0 bg-black/20 backdrop-blur-[2px] z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`absolute top-0 right-0 h-full w-full md:w-[500px] ${
          isDark ? "bg-dark-bg" : "bg-white"
        } md:border-l ${
          isDark ? "md:border-gray-700" : "md:border-gray-200"
        } shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b ${
            isDark ? "border-gray-700 bg-[#1f2329]" : "border-gray-200"
          } flex-shrink-0`}
        >
          <div className="flex items-center justify-between">
            <h2
              className={`text-lg font-medium truncate ${
                isDark ? "text-white " : "text-gray-900"
              }`}
            >
              Group info
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors duration-300 flex-shrink-0 ${
                isDark
                  ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                  : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-6 md:pb-4">
          
          {/* Group Info (Banner) */}
          <div
            className={`flex flex-col items-center py-8 border-b ${
              isDark ? "border-gray-700 bg-gray-850" : "border-gray-200 bg-gray-50"
            }`}
          >
            {/* Group Avatar */}
            <div
              className={`flex items-center justify-center w-28 h-28 md:w-32 md:h-32 rounded-full font-bold text-4xl md:text-5xl ${
                isDark
                  ? "bg-[#1f2329] text-white"
                  : "bg-[#1f2329] text-white"
              } shadow-lg mb-4`}
            >
              {getInitial(groupName)}
            </div>

            {/* Group Name */}
            {isEditingName ? (
              <div className="mb-1 px-4 flex justify-center w-full">
                <input
                  id="group-name-input"
                  type="text"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  onBlur={handleFinishEditing}
                  onKeyDown={handleKeyDown}
                  disabled={isSavingName}
                  autoFocus
                  className={`w-full max-w-lg text-center text-xl md:text-2xl font-bold px-1 bg-transparent focus:outline-none border-b border-gray-600 rounded-none ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                />
                {nameError && (
                  <div className="absolute mt-8 text-xs text-red-500">
                    {nameError}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center mb-1 px-4 gap-2">
                <div className="flex items-center justify-center gap-2">
                  <h1
                    className={`text-xl md:text-2xl font-bold text-center ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {groupName}
                  </h1>
                  {isAdmin && (
                    <button
                      onClick={handleStartEditName}
                      className={`p-1.5 rounded-full transition-colors ${
                        isDark
                          ? "hover:bg-gray-800 text-gray-600 hover:text-gray-400"
                          : "hover:bg-gray-100 text-gray-600 hover:text-gray-700"
                      }`}
                      title="Edit group name"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Member Count */}
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Group • {members.length} {members.length !== 1 ? "members" : "member"}
            </p>

            {/* Join Code Display */}
            {joinCode && (
              <div className="mt-4 px-4 py-3 bg-opacity-50 rounded-lg flex items-center gap-2 w-auto mx-auto"
                style={{
                  backgroundColor: isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.05)",
                  border: `1px solid ${isDark ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.2)"}`
                }}>
                <span className={`text-sm font-mono font-bold ${isDark ? "text-blue-300" : "text-blue-600"}`}>
                  {joinCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className={`p-1.5 rounded transition-colors ${
                    isDark
                      ? "hover:bg-gray-800 text-gray-600 hover:text-gray-400"
                      : "hover:bg-gray-100 text-gray-600 hover:text-gray-700"
                  }`}
                  title="Copy join code"
                >
                  {codeCopied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}

            {/* Admin Actions */}
            {isAdmin && (
              <div className="mt-6 w-full px-5 md:px-6">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={onAddMember}
                    className={`flex flex-col items-center justify-center gap-2 py-3 rounded-lg transition-colors ${
                      isDark
                        ? "bg-[#1f2329] hover:bg-gray-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-black"
                    }`}
                  >
                    <UserPlus className="w-5 h-5" />
                    <span className="text-xs font-medium">Add Member</span>
                  </button>
                  
                  {/* Share Invite Link Button */}
                  <button
                    onClick={handleCopyInviteLink}
                    className={`flex flex-col items-center justify-center gap-2 py-3 rounded-lg transition-colors ${
                      isDark
                        ? "bg-[#1f2329] hover:bg-gray-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-black"
                    }`}
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="text-xs font-medium">{inviteLinkCopied ? 'Link Copied!' : 'Share Link'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 1. Summary Section */}
          <div className={`summary-section ${isDark ? "bg-dark-bg" : "bg-white"} py-2`}>
            {/* Section Header */}
            <div className={`px-5 md:px-6 py-3 text-sm font-medium ${
               isDark ? "text-green-500" : "text-green-600"
            }`}>
               Summary
            </div>

            {summary.length === 0 ? (
               <div className={`px-5 md:px-6 py-2 text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                  All balances are settled.
               </div>
            ) : (
               <div className="flex flex-col">
                  {displayedSummary.map((item, index) => (
                      <div 
                         key={`${item.from}-${item.to}-${index}`}
                         className={`summary-item px-5 md:px-6 py-3 flex items-center justify-between group ${
                            isDark ? "hover:bg-gray-800/30" : "hover:bg-gray-50"
                         }`}
                      >
                         {/* Text Content */}
                         <div className={`text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                            <span className="font-semibold">{item.from}</span>
                            <span className={`mx-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>owes</span>
                            <span className="font-semibold">{item.to}</span>
                            <span className={`ml-2 font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                               ₹{Number(item.amount).toFixed(2)}
                            </span>
                         </div>

                         {/* Action Button */}
                         {isAdmin && onSettleUp && (
                            <button
                               onClick={() => onSettleUp(item.from, item.to, item.amount)}
                               className={`settle-up-action-button p-2 rounded-full transition-colors ${
                                  isDark 
                                     ? "text-green-500 hover:bg-gray-800" 
                                     : "text-green-600 hover:bg-gray-100"
                               }`}
                               title="Settle Up"
                            >
                               <HandCoins className="w-5 h-5" />
                            </button>
                         )}
                      </div>
                  ))}

                  {/* Show More / Show Less Button */}
                  {hasMoreSummary && (
                      <button
                         onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                         className={`w-full px-5 md:px-6 py-3 text-left text-sm font-medium flex items-center gap-2 ${
                            isDark 
                               ? "text-blue-400 hover:bg-gray-800/30" 
                               : "text-blue-600 hover:bg-gray-50"
                         }`}
                      >
                         {isSummaryExpanded ? (
                            <>
                               Show less <ChevronUp className="w-4 h-4" />
                            </>
                         ) : (
                            <>
                               Show more ({summary.length - SUMMARY_PREVIEW_LIMIT} more) <ChevronDown className="w-4 h-4" />
                            </>
                         )}
                      </button>
                  )}
               </div>
            )}
          </div>

          {/* 2. Participants Section */}
          <div className={`${isDark ? "bg-dark-bg" : "bg-white"} py-2`}>
            {/* Section Header */}
            <div className={`px-5 md:px-6 py-3 text-sm font-medium ${
               isDark ? "text-green-500" : "text-green-600"
            }`}>
              {members.length} participants
            </div>

            {/* Members List */}
            <div className="flex flex-col">
              {displayedMembers.map((member, index) => {
                // Extract the actual user ID (handle nested userId object)
                let memberId;
                if (member.userId && typeof member.userId === 'object' && member.userId._id) {
                  memberId = String(member.userId._id);
                } else if (member.userId && typeof member.userId === 'string') {
                  memberId = String(member.userId);
                } else {
                  memberId = String(member._id);
                }
                
                const cId = String(currentUserId);
                const isCurrentUser = memberId === cId;
                const isThisUserAdmin = isMemberAdmin(member);
                
                return (
                  <div
                    key={index}
                    onClick={() => handleMemberClick(member)}
                    className={`member-item flex items-center gap-3 justify-between px-5 md:px-6 py-3 transition-colors cursor-pointer ${
                      isDark ? "hover:bg-gray-800/30" : "hover:bg-gray-50"
                    }`}
                  >
                    {/* Avatar and Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Member Avatar with Admin Badge */}
                      <div className="relative flex-shrink-0">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm ${
                            isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {getInitial(member.name)}
                        </div>
                        
                        {/* WhatsApp-style Admin Badge on Avatar */}
                        {isThisUserAdmin && (
                          <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                            isDark ? "bg-green-600" : "bg-green-500"
                          } border-2 ${isDark ? "border-gray-900" : "border-white"}`}>
                            <Shield className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Member Info */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm truncate ${isDark ? "text-white" : "text-black"}`}>
                          {getMemberName(member)}
                        </p>
                        {member.email && member.email !== "No email" && (
                          <p className={`text-xs truncate ${isDark ? "text-gray-500" : "text-gray-600"}`}>
                            {member.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Menu Button (only show if isAdmin and NOT current user) */}
                    {isAdmin && !isCurrentUser && (
                      <div className="relative flex-shrink-0" ref={openMenuFor === member.name ? menuRef : null}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuFor(openMenuFor === member.name ? null : member.name);
                          }}
                          className={`p-2 rounded-full transition-colors ${
                            isDark ? "hover:bg-gray-800 text-gray-600" : "hover:bg-gray-200 text-gray-600"
                          }`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {openMenuFor === member.name && (
                          <div className={`absolute right-0 top-full mt-1 rounded-lg shadow-lg border z-50 min-w-[150px] ${
                            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                          }`}>
                            {isThisUserAdmin ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveAdmin(member.name);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                  isDark ? "text-red-400 hover:bg-gray-700" : "text-red-600 hover:bg-gray-100"
                                }`}
                              >
                                Remove Admin
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMakeAdmin(member.name);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                  isDark ? "text-green-400 hover:bg-gray-700" : "text-green-600 hover:bg-gray-100"
                                }`}
                              >
                                Make Admin
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* View All Button */}
              {!showAllMembers && hasMoreMembers && (
                <button
                  onClick={() => setShowAllMembers(true)}
                  className={`w-full px-5 md:px-6 py-3 text-left text-sm font-medium flex items-center gap-2 ${
                     isDark 
                        ? "text-blue-400 hover:bg-gray-800/30" 
                        : "text-blue-600 hover:bg-gray-50"
                  }`}
                >
                   View all ({members.length - MEMBERS_PREVIEW_LIMIT} more) <ChevronDown className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Strict Join Toggle (Admin Only) */}
          {isAdmin && (
            <div className={`px-5 md:px-6 py-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isStrictJoinEnabled ? (
                    <Lock className={`w-5 h-5 ${isDark ? "text-green-400" : "text-green-600"}`} />
                  ) : (
                    <LockOpen className={`w-5 h-5 ${isDark ? "text-green-400" : "text-green-600"}`} />
                  )}
                  <div>
                    <p className={`font-medium text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                      {isStrictJoinEnabled ? "Strict Join" : "Easy Join"}
                    </p>
                    <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {isStrictJoinEnabled ? "Members need approval" : "Members join automatically"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleToggleStrictJoin}
                  disabled={isTogglingStrictJoin}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    isStrictJoinEnabled
                      ? isDark
                        ? "bg-green-600/40"
                        : "bg-green-100"
                      : isDark
                      ? "bg-gray-700/40"
                      : "bg-gray-100"
                  } ${isTogglingStrictJoin ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                      isStrictJoinEnabled ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Join Requests Section (Show when Strict Join is Enabled) */}
          {isAdmin && isStrictJoinEnabled && joinRequests && joinRequests.length > 0 && (
            <div className={`px-5 md:px-6 py-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
              <h3 className={`font-medium text-sm mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                Join Requests ({joinRequests.length})
              </h3>
              <div className="space-y-2">
                {joinRequests.map((request) => {
                  const requester = request.requester;
                  // Handle both populated object and simple ID string
                  const requesterId = requester?._id || requester;
                  const requesterName = requester?.name || "Unknown";
                  const requesterEmail = requester?.email;
                  const requestState = requestsStates[requesterId];
                  
                  return (
                    <div
                      key={requesterId}
                      className={`flex items-center justify-between gap-2 p-3 rounded-lg ${
                        isDark ? "bg-gray-800/50" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                          {requesterName}
                        </p>
                        {requesterEmail && (
                          <p className={`text-xs truncate ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                            {requesterEmail}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleApproveRequest(requesterId)}
                          disabled={!!requestState}
                          className={`p-2 rounded transition-colors ${
                            requestState === 'approved'
                              ? isDark
                                ? "bg-green-900/40 text-green-400"
                                : "bg-green-100 text-green-600"
                              : requestState === 'approving'
                              ? isDark
                                ? "bg-gray-700 text-gray-400"
                                : "bg-gray-200 text-gray-400"
                              : isDark
                              ? "hover:bg-green-900/40 text-green-400"
                              : "hover:bg-green-100 text-green-600"
                          } ${requestState ? "cursor-not-allowed" : ""}`}
                          title="Approve request"
                        >
                          {requestState === 'approved' ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4 opacity-60" />
                          )}
                        </button>
                        <button
                          onClick={() => handleRejectRequest(requesterId)}
                          disabled={!!requestState}
                          className={`p-2 rounded transition-colors ${
                            requestState === 'rejected'
                              ? isDark
                                ? "bg-red-900/40 text-red-400"
                                : "bg-red-100 text-red-600"
                              : requestState === 'rejecting'
                              ? isDark
                                ? "bg-gray-700 text-gray-400"
                                : "bg-gray-200 text-gray-400"
                              : isDark
                              ? "hover:bg-red-900/40 text-red-400"
                              : "hover:bg-red-100 text-red-600"
                          } ${requestState ? "cursor-not-allowed" : ""}`}
                          title="Reject request"
                        >
                          {requestState === 'rejected' ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4 opacity-60" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className={`px-5 md:px-6 py-4 pb-12 md:pb-4 ${isDark ? "bg-dark-bg" : "bg-white"}`}>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to leave this group?")) {
                  onLeave();
                }
              }}
              className={`flex items-center gap-3 py-2 transition-colors ${
                isDark
                  ? "text-red-400 hover:text-red-300"
                  : "text-red-600 hover:text-red-700"
              }`}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-base">Exit group</span>
            </button>
            {isAdmin && onDeleteGroup && (
              <button
                onClick={onDeleteGroup}
                className={`mt-3 flex items-center gap-3 py-2 transition-colors ${
                  isDark
                    ? "text-red-400 hover:text-red-300"
                    : "text-red-600 hover:text-red-700"
                }`}
              >
                <Trash2 className="w-5 h-5" />
                <span className="font-medium text-base">Delete group</span>
              </button>
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

      {/* Member Info Sidebar */}
      <MemberInfoSidebar
        isOpen={showMemberInfo}
        onClose={handleCloseMemberInfo}
        isDark={isDark}
        member={selectedMember}
        currentUserId={currentUserId}
        isAdmin={isAdmin}
        groupId={groupId}
        friends={friends}
        requests={requests}
        onFriendRequestSent={onFriendRequestSent}
        balances={balances}
        membersWithSpend={membersWithSpend}
      />
    </>
  );
};

export default GroupInfoSidebar;