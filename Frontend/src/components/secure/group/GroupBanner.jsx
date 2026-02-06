import React from "react";
import { Search, MoreVertical, ArrowLeft } from "lucide-react";

const GroupBanner = ({ 
  groupName, 
  isDark, 
  isAdmin = false,
  onInfoClick, 
  onSearchClick, 
  onMenuClick,
  onBackClick,
  socketConnected = false 
}) => {
  // Get first letter of group name for avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "G";
  };

  return (
    <div
      className={`flex-shrink-0 ${
        isDark
          ? "bg-dark-bg border-gray-800"
          : "bg-white border-gray-200"
      } border-b shadow-lg`}
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Group Avatar and Info */}
          <div 
            className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onInfoClick}
          >
            {/* Group Avatar Circle with First Letter */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${
                isDark
                  ? "bg-[#1f2329] text-white"
                  : "bg-[#1f2329] text-white"
              } shadow-md`}
            >
              {getInitial(groupName)}
            </div>

            {/* Group Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1
                  className={`text-base sm:text-lg font-semibold truncate ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {groupName}
                </h1>
              </div>
              <p
                className={`text-xs truncate ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                click here for group info
              </p>
            </div>
          </div>

          {/* Right: Action Icons */}
          <div className="flex items-center gap-2">
            {/* Back Icon (Mobile Only) */}
            <button
              onClick={onBackClick}
              className={`md:hidden p-2 rounded-full transition-all duration-200 ${
                isDark
                  ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                  : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              }`}
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            {/* Search Icon */}
            <button
              onClick={onSearchClick}
              className={`p-2 rounded-full transition-all duration-200 ${
                isDark
                  ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                  : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              }`}
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupBanner;
