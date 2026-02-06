// BottomNavigation.jsx
import React from "react";
import { Users, UserPlus, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BottomNavigation = ({ isDark, activeTab, onTabChange }) => {
  const navigate = useNavigate();

  const navItems = [
    { icon: Users, label: "Groups", id: "home" },
    { icon: UserPlus, label: "Friends", id: "friends" },
    { icon: Settings, label: "Settings", id: "settings" },
  ];

  const handleItemClick = (itemId) => {
    onTabChange(itemId);

    // Navigate to the correct path
    if (itemId === "home") {
      navigate("/home");
    } else {
      navigate(`/${itemId}`);
    }
  };
  return (
    <nav
      className={`
      md:hidden fixed bottom-0 left-0 right-0 z-50
      ${isDark ? "bg-[#1f2329] border-dark-border" : "bg-white border-gray-200"}
      border-t px-4 py-2
    `}
    >
      <div className="flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={`
              flex flex-col items-center py-2 px-3 rounded-lg transition-colors
              ${
                activeTab === item.id
                  ? isDark
                    ? "text-white bg-dark-bg"
                    : "text-green-600 bg-green-50"
                  : isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }
            `}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
