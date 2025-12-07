import React, { useState ,useEffect} from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";
import BottomNavigation from "./bottomNavigation";
import BackgroundWrapper from "./backgroundWrapper";
import { useTheme } from "../../../context/themeContext";
import GroupList from "./groupsList";
import { Users } from "lucide-react";
import CreateGroupList from "./groupCreate"; 
import FriendManagement from "../friends/friends";
import RequestPasswordReset from "../settings/settings";

const MainLayout = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [showNewComponent, setShowNewComponent] = useState(false); 

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const location = useLocation();
  const isGroupPage = location.pathname.startsWith("/groups/");
  const isHomePage = location.pathname === "/home";

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

  // Render content based on active tab (for mobile)
  const renderMobileContent = () => {
    switch (activeTab) {
      case "home":
        return showNewComponent ? (
          <CreateGroupList
            onBack={() => setShowNewComponent(false)}
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
           <FriendManagement isDark={isDark}/>
        );
      case "settings":
        return (
          <RequestPasswordReset isDark={isDark}/>
        );
     
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

      <Sidebar isOpen={isSidebarOpen} isDark={isDark} />

      <BottomNavigation
        isDark={isDark}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area - WhatsApp Web Style */}
      <main
        className={`
        transition-all duration-300
        ${isSidebarOpen ? "md:ml-64" : "md:ml-16"}
        pt-16 pb-20 md:pb-0
        h-screen
      `}
      >
        <div className="h-full flex">
          {/* Primary Component - Group List */}
          <div
            className={`
            ${isGroupPage ? "hidden md:block" : "block"}
            w-full md:w-96 h-full flex-shrink-0
            ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } 
            md:border-r
            overflow-hidden
          `}
          >
            {/* Desktop: Always show groups, Mobile: Show based on activeTab */}
            <div className="hidden md:block h-full overflow-y-auto">
              {showNewComponent ? (
                <CreateGroupList
                  onBack={() => setShowNewComponent(false)}
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

          {/* Secondary Component (Desktop only) - Full width */}
          <div
            className={`
            ${isGroupPage ? "flex" : "hidden md:flex"}
            flex-1 h-full min-w-0
            ${isDark ? "bg-gray-900" : "bg-gray-50"}
          `}
          >
            {isHomePage ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-center">
                  <Users
                    className={`w-16 h-16 mx-auto mb-4 ${
                      isDark ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                  <h3
                    className={`text-lg font-medium mb-2 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Select a group to start splitting 
                  </h3>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    Choose from your existing groups
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full">
                <Outlet context={{ isDark }}/>
              </div>
            )}
          </div>
        </div>
      </main>
    </BackgroundWrapper>
  );
};

export default MainLayout;