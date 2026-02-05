import React, { useEffect, useState } from "react";
import { X, LogOut, HandCoins, ChevronDown, ChevronUp, UserPlus, Pencil, ShieldOff, Trash2 } from "lucide-react";
import useStore from "../../../store/useStore";
import MemberInfoSidebar from "./MemberInfoSidebar";

const GroupInfoSidebar = ({ 
  isOpen, 
  onClose, 
  isDark, 
  groupName,
  members = [],
  onLeave,
  currentUserId,
  admin,
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
  onDeleteGroup
}) => {
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberInfo, setShowMemberInfo] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(groupName || "");
  const [nameError, setNameError] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);

  const { updateGroup } = useStore();
  
  const MEMBERS_PREVIEW_LIMIT = 6;
  const SUMMARY_PREVIEW_LIMIT = 4;

  useEffect(() => {
    if (!isEditingName) {
      setNameDraft(groupName || "");
      setNameError("");
    }
  }, [groupName, isEditingName]);

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
    if (!admin) return false;
    const adminId = typeof admin === "object" 
      ? (admin._id || admin.userId) 
      : admin;
    const memberId = member._id || member.userId;
    return String(adminId) === String(memberId);
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
          isDark ? "bg-gray-900" : "bg-white"
        } md:border-l ${
          isDark ? "md:border-gray-700" : "md:border-gray-200"
        } shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b ${
            isDark ? "border-gray-700" : "border-gray-200"
          } flex-shrink-0`}
        >
          <div className="flex items-center justify-between">
            <h2
              className={`text-lg font-medium truncate ${
                isDark ? "text-white" : "text-gray-900"
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
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-4">
          
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
                  ? "bg-gradient-to-br from-green-600 to-green-500 text-white"
                  : "bg-gradient-to-br from-green-500 to-green-400 text-white"
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
              <div className="flex items-center justify-center gap-2 mb-1 px-4 group">
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
                    className={`p-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 ${
                      isDark
                        ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                        : "hover:bg-gray-100 text-gray-500 hover:text-gray-800"
                    }`}
                    title="Edit group name"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
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

            {/* Admin Actions */}
            {isAdmin && (
              <div className="mt-6 w-full px-5 md:px-6">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={onAddMember}
                    className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl transition-colors ${
                      isDark
                        ? "bg-gray-800/60 hover:bg-gray-800 text-green-400"
                        : "bg-gray-100 hover:bg-gray-200 text-green-600"
                    }`}
                  >
                    <UserPlus className="w-5 h-5" />
                    <span className="text-xs font-medium">Add</span>
                  </button>
                  <button
                    onClick={onChangeAdmin}
                    className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl transition-colors ${
                      isDark
                        ? "bg-gray-800/60 hover:bg-gray-800 text-orange-400"
                        : "bg-gray-100 hover:bg-gray-200 text-orange-600"
                    }`}
                  >
                    <ShieldOff className="w-5 h-5" />
                    <span className="text-xs font-medium">Admin</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 1. Summary Section */}
          <div className={`${isDark ? "bg-gray-900" : "bg-white"} py-2`}>
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
                         className={`px-5 md:px-6 py-3 flex items-center justify-between group ${
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
                               className={`p-2 rounded-full transition-colors ${
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
          
          {/* Divider */}
          <div className={`h-2 ${isDark ? "bg-black/20" : "bg-gray-50"}`}></div>

          {/* 2. Participants Section */}
          <div className={`${isDark ? "bg-gray-900" : "bg-white"} py-2`}>
            {/* Section Header */}
            <div className={`px-5 md:px-6 py-3 text-sm font-medium ${
               isDark ? "text-green-500" : "text-green-600"
            }`}>
              {members.length} participants
            </div>

            {/* Members List */}
            <div className="flex flex-col">
              {displayedMembers.map((member, index) => (
                <div
                  key={index}
                  onClick={() => handleMemberClick(member)}
                  className={`flex items-center gap-4 px-5 md:px-6 py-3 cursor-pointer transition-colors ${
                    isDark ? "hover:bg-gray-800/30" : "hover:bg-gray-50"
                  }`}
                >
                  {/* Member Avatar */}
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm flex-shrink-0 ${
                      isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {getInitial(member.name)}
                  </div>

                  {/* Member Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Member Name */}
                        <p className={`font-medium text-base truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                          {getMemberName(member)}
                        </p>

                        {/* Group Admin Badge */}
                        {isMemberAdmin(member) && (
                           <span className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider font-semibold whitespace-nowrap ${
                              isDark 
                                ? "border-green-600 text-green-400 bg-green-900/20" 
                                : "border-green-500 text-green-600 bg-green-50"
                           }`}>
                              Group admin
                           </span>
                        )}
                      </div>
                    </div>
                    
                    {member.email && member.email !== "No email" && (
                      <p className={`text-xs truncate mt-0.5 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                        {member.email}
                      </p>
                    )}
                  </div>
                </div>
              ))}

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
          
          {/* Divider */}
          <div className={`h-2 ${isDark ? "bg-black/20" : "bg-gray-50"}`}></div>

          {/* Exit Group Button */}
          <div className={`px-5 md:px-6 py-4 ${isDark ? "bg-gray-900" : "bg-white"}`}>
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