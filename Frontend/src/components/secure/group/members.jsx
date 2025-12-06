import React, { useState, Suspense, lazy } from "react";
import { Users, ChevronDown, ChevronUp, UserMinus } from "lucide-react";

const RemoveMemberForm = lazy(() => import("../admin/removemember"));

const MembersComponent = ({ members, isAdmin, groupId, onMemberRemoved }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRemoveMemberOpen, setIsRemoveMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const toggleRemoveMemberForm = (member) => {
    setSelectedMember(member);
    setIsRemoveMemberOpen(!isRemoveMemberOpen);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl border border-gray-800 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="p-1.5 sm:p-2 bg-green-700/10 rounded-lg flex-shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xl sm:text-2xl font-bold text-white truncate">Members</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">{members.length} member(s)</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 sm:gap-2 text-green-700 hover:text-green-400 transition-colors duration-300 flex-shrink-0"
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
          {members.map((member, index) => (
            <div
              key={member._id || index}
              className="bg-gray-900/50 border-2 border-gray-800 hover:border-gray-700 p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base text-white font-medium">
                    {index + 1}. {member.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 truncate mt-1">
                    {member.email || "No email"}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => toggleRemoveMemberForm(member)}
                    className="ml-2 sm:ml-4 flex items-center gap-1.5 sm:gap-2 bg-red-500 hover:text-black  text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-300 shadow-lg  flex-shrink-0 text-xs sm:text-sm active:scale-[0.98]"
                  >
                    <UserMinus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Remove</span>
                    <span className="xs:hidden">×</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Remove Member Form */}
      {isRemoveMemberOpen && selectedMember && (
        <Suspense fallback={<div className="text-center text-gray-500 mt-4">Loading...</div>}>
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