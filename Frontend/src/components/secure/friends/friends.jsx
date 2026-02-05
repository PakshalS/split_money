import React, { useState } from "react";
import { Heart, UserPlus, Clock, Users, ChevronLeft } from "lucide-react";
import SendRequestComponent from "./sendreq";
import RequestListComponent from "./reqlist";
import FriendListComponent from "./managefriends";
import { FriendManagementSkeleton } from "./friendsloader";
import useStore from "../../../store/useStore";
import { useTheme } from "../../../context/themeContext";
import { useOutletContext } from "react-router-dom";

const FriendManagement = ({
  friends: friendsProp,
  requests: requestsProp,
  loading: loadingProp,
  onRefreshFriends: onRefreshFriendsProp,
  onRefreshRequests: onRefreshRequestsProp,
  onRefreshAll: onRefreshAllProp,
  isDark: isDarkProp,
  selectedOption: selectedOptionProp,
  onSelectOption: onSelectOptionProp,
  showContentInline = true,
}) => {
  // Get theme from context
  const { isDark: themeIsDark } = useTheme();
  const outletContext = useOutletContext() || {};

  // Get data from Zustand store
  const {
    friends: storeFriends,
    requests: storeRequests,
    isLoadingFriends,
    isLoadingRequests,
    fetchFriends,
    fetchRequests,
    fetchAllFriendsData,
  } = useStore();

  // Local state for selected option
  const [localSelectedOption, setLocalSelectedOption] = useState("list");

  // Use props first, fallback to theme context, then outlet context
  const isDark = isDarkProp ?? themeIsDark ?? outletContext.isDark ?? false;
  const friends = friendsProp ?? storeFriends ?? [];
  const requests = requestsProp ?? storeRequests ?? [];
  const loading = loadingProp ?? (isLoadingFriends || isLoadingRequests) ?? false;
  
  // Use prop-based selection if provided, otherwise local state
  const selectedOption = selectedOptionProp ?? localSelectedOption;
  const setSelectedOption = onSelectOptionProp ?? setLocalSelectedOption;

  // Handlers that call store functions
  const handleRequestSent = () => {
    fetchRequests();
  };

  const handleRequestResponded = () => {
    fetchAllFriendsData();
  };

  const handleFriendRemoved = () => {
    fetchFriends();
  };

  const friendOptions = [
    {
      id: "send-request",
      label: "Send Request",
      description: "Connect with friends by email",
      icon: UserPlus,
    },
    {
      id: "manage-requests",
      label: "Manage Requests",
      description: `${requests.length} pending request${requests.length !== 1 ? 's' : ''}`,
      icon: Clock,
    },
    {
      id: "manage-friends",
      label: "Manage Friends",
      description: `${friends.length} friend${friends.length !== 1 ? 's' : ''}`,
      icon: Users,
    },
  ];

  if (loading) {
    return <FriendManagementSkeleton isDark={isDark} />;
  }

  // Show content when an option is selected (only if showContentInline is true)
  if (showContentInline && selectedOption && selectedOption !== "list") {
    const option = friendOptions.find((o) => o.id === selectedOption);
    
    return (
      <div
        className={`h-full flex flex-col ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header with back button */}
        <div
          className={`p-4 border-b flex items-center gap-3 flex-shrink-0 ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <button
            onClick={() => setSelectedOption("list")}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2
            className={`text-lg font-semibold flex-1 truncate ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {option?.label}
          </h2>
        </div>

        {/* Content */}
        <div
          className={`flex-1 overflow-y-auto p-4 scrollbar-hide`}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {selectedOption === "send-request" && (
            <SendRequestComponent
              isDark={isDark}
              onRequestSent={handleRequestSent}
            />
          )}
          {selectedOption === "manage-requests" && (
            <RequestListComponent
              requests={requests}
              isDark={isDark}
              onRequestResponded={handleRequestResponded}
            />
          )}
          {selectedOption === "manage-friends" && (
            <FriendListComponent
              friends={friends}
              isDark={isDark}
              onFriendRemoved={handleFriendRemoved}
            />
          )}
        </div>
      </div>
    );
  }

  // Show list view
  return (
    <div
      className={`h-full flex flex-col ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}
    >
      {/* Header */}
      <div className="p-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Heart
            className={`w-6 h-6 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <h2
            className={`text-lg font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Friends
          </h2>
        </div>
      </div>

      {/* Friends Options List */}
      <div
        className="flex-1 overflow-y-auto scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {friendOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedOption(option.id)}
            className={`w-full p-4 border-b text-left cursor-pointer transition-colors ${
              isDark
                ? "hover:bg-gray-700 border-gray-700"
                : "hover:bg-gray-50 border-gray-100"
            }`}
          >
            <div className="flex items-center space-x-3">
              {option.icon && React.createElement(option.icon, {
                className: `w-5 h-5 flex-shrink-0 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`
              })}
              <div className="min-w-0 flex-1">
                <h4
                  className={`font-medium text-sm ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {option.label}
                </h4>
                <p
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {option.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FriendManagement;
