import React, { lazy, Suspense } from "react";
import SendRequestComponent from "./sendreq";
import RequestListComponent from "./reqlist";
import FriendListComponent from "./managefriends";
import { FriendManagementSkeleton } from "./friendsloader";
import { useOutletContext } from "react-router-dom";

const FriendManagement = ({
  friends: friendsProp,
  requests: requestsProp,
  loading: loadingProp,
  onRefreshFriends: onRefreshFriendsProp,
  onRefreshRequests: onRefreshRequestsProp,
  onRefreshAll: onRefreshAllProp,
  isDark: isDarkProp,
}) => {
  const outletContext = useOutletContext() || {};

  // Use props first, fallback to outlet context
  const isDark = isDarkProp ?? outletContext.isDark ?? false;
  const friends = friendsProp ?? outletContext.friends ?? [];
  const requests = requestsProp ?? outletContext.requests ?? [];
  const loading = loadingProp ?? outletContext.friendsLoading ?? false;
  const onRefreshFriends =
    onRefreshFriendsProp ?? outletContext.onRefreshFriends;
  const onRefreshRequests =
    onRefreshRequestsProp ?? outletContext.onRefreshRequests;
  const onRefreshAll = onRefreshAllProp ?? outletContext.onRefreshAll;

  const handleRequestSent = () => {
    if (onRefreshRequests) onRefreshRequests();
  };

  const handleRequestResponded = () => {
    if (onRefreshAll) onRefreshAll();
  };

  const handleFriendRemoved = () => {
    if (onRefreshFriends) onRefreshFriends();
  };

  if (loading) {
    return <FriendManagementSkeleton isDark={isDark} />;
  }

  return (
    <Suspense fallback={<FriendManagementSkeleton isDark={isDark} />}>
      <div
        className={`min-h-screen flex flex-col items-center p-4 ${
          isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="w-full max-w-6xl space-y-6">
          {/* Send Request Section */}
          <div className="w-full">
            <SendRequestComponent
              isDark={isDark}
              onRequestSent={handleRequestSent}
            />
          </div>

          {/* Two Column Layout for Requests and Friends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Requests */}
            <div className="w-full">
              <RequestListComponent
                requests={requests}
                isDark={isDark}
                onRequestResponded={handleRequestResponded}
              />
            </div>

            {/* Friends List */}
            <div className="w-full">
              <FriendListComponent
                friends={friends}
                isDark={isDark}
                onFriendRemoved={handleFriendRemoved}
              />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default FriendManagement;
