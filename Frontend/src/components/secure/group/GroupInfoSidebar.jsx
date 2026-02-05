import React, { useState } from "react";
import { X, UserPlus, LogOut, UserMinus, Clock } from "lucide-react";
import useStore from "../../../store/useStore";
import MemberInfoSidebar from "./MemberInfoSidebar";
import SummaryComponent from "./summary";

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
  onSettleUp
}) => {
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberInfo, setShowMemberInfo] = useState(false);
  const MEMBERS_PREVIEW_LIMIT = 6;

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

  // Get initials for member avatars
  const getMemberInitial = (member) => {
    return getInitial(member.name);
  };

  // Get member display name
  const getMemberName = (member) => {
    return member.name || "Unknown";
  };

  // Check if member is group admin
  const isMemberAdmin = (member) => {
    return admin && member._id === admin._id;
  };

  // Determine which members to display
  const displayedMembers = showAllMembers 
    ? members 
    : members.slice(0, MEMBERS_PREVIEW_LIMIT);
  
  const hasMoreMembers = members.length > MEMBERS_PREVIEW_LIMIT;

  return (
    <>
      {/* Backdrop - Adjusted for less blur and opacity */}
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
            <div className="flex items-center gap-2 min-w-0">
              <h2
                className={`text-lg font-medium truncate ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Group info
              </h2>
            </div>
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
          
          {/* Group Info Section */}
          <div
            className={`flex flex-col items-center py-8 border-b ${
              isDark ? "border-gray-700 bg-gray-850" : "border-gray-200 bg-gray-50"
            }`}
          >
            {/* Group Avatar - Resized to match WhatsApp Style (Smaller) */}
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
            <h1
              className={`text-xl md:text-2xl font-bold mb-1 px-4 text-center ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {groupName}
            </h1>

            {/* Member Count */}
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Group • {members.length} {members.length !== 1 ? "members" : "member"}
            </p>
          </div>

          {/* Summary Section */}
          <div className={`px-5 md:px-6 py-4 border-b ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}>
            <SummaryComponent
              summary={summary}
              isDark={isDark}
              isAdmin={isAdmin}
              onSettleUp={onSettleUp}
              compact
            />
          </div>

          {/* Members Section */}
          <div className={`${isDark ? "bg-gray-900" : "bg-white"}`}>
            <div
              className={`px-5 md:px-6 py-4 ${
                isDark ? "text-green-500" : "text-green-600"
              } text-sm font-medium`}
            >
              {members.length} participants
            </div>

            {/* Members List */}
            <div>
              {displayedMembers.map((member, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => handleMemberClick(member)}
                    className={`flex items-center gap-4 px-5 md:px-6 py-3 transition-colors cursor-pointer ${
                      isDark
                        ? "hover:bg-gray-800/50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {/* Member Avatar */}
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm flex-shrink-0 ${
                        isDark
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {getMemberInitial(member)}
                    </div>

                    {/* Member Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p
                          className={`font-medium text-base truncate ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {getMemberName(member)}
                          {isMemberAdmin(member) && (
                            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded border ${
                              isDark ? "border-green-600 text-green-500" : "border-green-500 text-green-600"
                            }`}>
                              Admin
                            </span>
                          )}
                        </p>
                      </div>
                      
                      {member.email && member.email !== "No email" && (
                        <p className={`text-xs truncate ${
                          isDark ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {member.email}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* View All Button */}
              {!showAllMembers && hasMoreMembers && (
                <button
                  onClick={() => setShowAllMembers(true)}
                  className={`w-full px-5 md:px-6 py-4 text-left transition-colors flex items-center gap-4 ${
                    isDark
                      ? "hover:bg-gray-800/50"
                      : "hover:bg-gray-50"
                  }`}
                >
                   <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                     isDark ? "bg-gray-800" : "bg-gray-100"
                   }`}>
                     <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                       +{members.length - MEMBERS_PREVIEW_LIMIT}
                     </span>
                   </div>
                  <span className={`font-medium ${isDark ? "text-green-500" : "text-green-600"}`}>
                    View all members
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Exit Group Button - Inside scrollable content */}
          <div className={`p-5 md:p-6 ${isDark ? "bg-gray-900" : "bg-white"}`}>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to leave this group?")) {
                  onLeave();
                }
              }}
              className={`w-full flex items-center gap-3 px-5 py-3 rounded-lg transition-colors ${
                isDark
                  ? "hover:bg-red-900/20 text-red-400 hover:text-red-300"
                  : "hover:bg-red-50 text-red-600 hover:text-red-700"
              }`}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-base">Exit group</span>
            </button>
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