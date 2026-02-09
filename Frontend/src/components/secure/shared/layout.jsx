import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";
import BottomNavigation from "./bottomNavigation";
import BackgroundWrapper from "./backgroundWrapper";
import { useTheme } from "../../../context/themeContext";
import GroupList from "./groupsList";
import SettingsMenu from "../settings/SettingsMenu";
import { Users, Heart } from "lucide-react";
import CreateGroupList from "./groupCreate";
import FriendManagement from "../friends/friends";
import RequestPasswordReset from "../settings/settings";
import WelcomeTourModal from "./WelcomeTourModal";
import Cookies from "js-cookie";
import useStore from "../../../store/useStore";
import apiClient from "../../../api/client";

const MainLayout = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [showNewComponent, setShowNewComponent] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState("list");
  const [selectedFriendOption, setSelectedFriendOption] = useState("list");
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);

  // ===== ZUSTAND STORE =====
  // Groups from store
  const { groups, isLoadingGroups, fetchGroups, prefetchGroupDetails } = useStore();
  
  // Friends from store (cached globally)
  const { 
    friends, 
    requests, 
    isLoadingFriends, 
    isLoadingRequests, 
    fetchFriends,
    fetchRequests,
    fetchAllFriendsData 
  } = useStore();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const location = useLocation();
  const isGroupPage = location.pathname.startsWith("/groups/");
  const isSettingsPage = location.pathname === "/settings";
  const isFriendsPage = location.pathname === "/friends";
  const isHomePage = location.pathname === "/home";

  // Initial fetch on mount
  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      fetchGroups();
      fetchAllFriendsData();
      
      // Fetch user profile to check tour status
      const fetchUserProfile = async () => {
        try {
          const response = await apiClient.get('/auth/profile');
          if (response.data?.user) {
            const status = response.data.user.tourStatus || "not-prompted";
            
            // Show welcome modal if tour not taken (with a small delay)
            if (status === "not-prompted") {
              setTimeout(() => {
                setShowWelcomeTour(true);
              }, 1000); // Wait 1 second after page load
            }
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      };
      
      fetchUserProfile();
    }
  }, []);

  // Prefetch top groups in background after groups load
  useEffect(() => {
    if (groups && groups.length > 0) {
      // Prefetch the first 5 groups in background for instant access
      const groupIds = groups.slice(0, 5).map(g => g._id);
      
      // Use setTimeout to avoid blocking the main thread
      setTimeout(() => {
        prefetchGroupDetails(groupIds, 3); // Prefetch 3 at a time
      }, 500); // Wait 500ms after groups load
    }
  }, [groups, prefetchGroupDetails]);

  useEffect(() => {
    const path = location.pathname;
    if (path === "/home" || path === "/" || path.startsWith("/groups/")) {
      setActiveTab("home");
    } else if (path === "/friends") {
      setActiveTab("friends");
    } else if (path === "/settings") {
      setActiveTab("settings");
    }
  }, [location.pathname]);

  // Handle group creation
  const handleGroupCreated = (newGroup) => {
    // Groups are automatically updated in store, just close the form
    setShowNewComponent(false);
  };

  // Render content based on active tab (for mobile)
  const renderMobileContent = () => {
    switch (activeTab) {
      case "home":
        return showNewComponent ? (
          <CreateGroupList
            onBack={() => setShowNewComponent(false)}
            onGroupCreated={handleGroupCreated}
            isDark={isDark}
          />
        ) : (
          <GroupList
            isDark={isDark}
            onFabClick={() => setShowNewComponent(true)}
          />
        );
      case "friends":
        return (
          <FriendManagement
            friends={friends}
            requests={requests}
            loading={isLoadingFriends || isLoadingRequests}
            onRefreshFriends={fetchFriends}
            onRefreshRequests={fetchRequests}
            onRefreshAll={fetchAllFriendsData}
            isDark={isDark}
            selectedOption={selectedFriendOption}
            onSelectOption={setSelectedFriendOption}
          />
        );
      case "settings":
        return <SettingsMenu isDark={isDark} selectedSetting={selectedSetting} onSelectSetting={setSelectedSetting} />;
      default:
        return null;
    }
  };

  return (
    <BackgroundWrapper>
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      <Sidebar isOpen={isSidebarOpen} isDark={isDark} toggleTheme={toggleTheme} toggleSidebar={toggleSidebar} />

      {!isGroupPage && (
        <BottomNavigation
          isDark={isDark}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}

      {/* Main Content Area - WhatsApp Web Style */}
      <main
        className={`
        transition-all duration-300
        ${isSidebarOpen ? "md:ml-56" : "md:ml-16"}
        ${isGroupPage ? "pt-0 md:pt-0 pb-2 md:pb-0" : "pt-16 md:pt-0 pb-20"} md:pb-0
        h-screen
      `}
      >
        <div className="h-full flex">
          {/* Primary Component - Always narrow panel on desktop */}
          <div
            className={`
            ${isGroupPage ? "hidden md:block" : "block"}
            w-full md:w-96 h-full flex-shrink-0
            ${
              isDark
                ? "bg-dark-bg border-gray-700"
                : "bg-white border-gray-200"
            } 
            md:border-r
            overflow-hidden
          `}
          >
            {/* Desktop: Show content based on route */}
            <div className="hidden md:block h-full overflow-y-auto">
              {isSettingsPage ? (
                <SettingsMenu
                  isDark={isDark}
                  selectedSetting={selectedSetting}
                  onSelectSetting={setSelectedSetting}
                  showContentInline={true}
                />
              ) : isFriendsPage ? (
                <FriendManagement
                  friends={friends}
                  requests={requests}
                  loading={isLoadingFriends || isLoadingRequests}
                  onRefreshFriends={fetchFriends}
                  onRefreshRequests={fetchRequests}
                  onRefreshAll={fetchAllFriendsData}
                  isDark={isDark}
                  selectedOption={selectedFriendOption}
                  onSelectOption={setSelectedFriendOption}
                  showContentInline={true}
                />
              ) : showNewComponent ? (
                <CreateGroupList
                  onBack={() => setShowNewComponent(false)}
                  onGroupCreated={handleGroupCreated}
                  isDark={isDark}
                />
              ) : (
                <GroupList
                  isDark={isDark}
                  onFabClick={() => setShowNewComponent(true)}
                />
              )}
            </div>

            {/* Mobile view - renders based on activeTab */}
            <div className="md:hidden h-full overflow-y-auto">
              {renderMobileContent()}
            </div>
          </div>

          {/* Divider (WhatsApp style) */}
          <div
            className={`hidden md:block w-px flex-shrink-0 ${
              isDark ? "bg-gray-700" : "bg-gray-300"
            }`}
          />

          {/* Secondary Component (Desktop only) - Shows group content or empty state */}
          <div
            className={`
            ${isGroupPage ? "flex" : "hidden md:flex"}
            flex-1 h-full min-w-0
            ${isDark ? "bg-dark-bg" : "bg-gray-50"}
          `}
          >
            {isGroupPage ? (
              <div className="w-full h-full">
                <Outlet
                  context={{
                    isDark,
                    // Friends data from store (cached globally)
                    friends,
                    requests,
                    friendsLoading: isLoadingFriends || isLoadingRequests,
                    onRefreshFriends: fetchFriends,
                    onRefreshRequests: fetchRequests,
                    onRefreshAll: fetchAllFriendsData,
                  }}
                />
              </div>
            ) : isHomePage ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-center">
        
                  <h3
                    className={`text-lg font-medium mb-2 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Create and Join Groups
                  </h3>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    Start splitting expenses with your groups
                  </p>
                </div>
              </div>
            ) : isFriendsPage ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-center">
                  <Heart
                    className={`w-16 h-16 mx-auto mb-4 ${
                      isDark ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                  <h3
                    className={`text-lg font-medium mb-2 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Friends
                  </h3>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    Manage your friends and requests
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-center">
    
                  <h3
                    className={`text-lg font-medium mb-2 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Settings
                  </h3>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    Select a setting to configure
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Welcome Tour Modal */}
      <WelcomeTourModal 
        isOpen={showWelcomeTour} 
        onClose={() => setShowWelcomeTour(false)}
        isDark={isDark}
      />

    </BackgroundWrapper>
  );
};

export default MainLayout;
