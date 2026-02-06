import React, { useState } from "react";
import { Search, Lock, KeyRound, ChevronLeft, ChevronRight } from "lucide-react";
import RequestPasswordResetComponent from "./reqreset";
import ChangePasswordComponent from "./changepass";

const SettingsMenu = ({ isDark, selectedSetting, onSelectSetting, showContentInline = true }) => {
  // Define settings first to use the ID for initialization
  const mainSettings = [
    {
      id: "account",
      label: "Account",
      icon: Lock,
      subsettings: [
        {
          id: "reset-password",
          label: "Reset Password",
          description: "Request a password reset",
          icon: KeyRound,
        },
        {
          id: "change-password",
          label: "Change Password",
          description: "Update your password",
          icon: Lock,
        },
      ],
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  
  // CHANGED: Initialize with "account" so it is expanded by default
  const [expandedCategory, setExpandedCategory] = useState("account");

  // Flatten all settings for filtering
  const allSettings = mainSettings.flatMap(cat => [cat, ...cat.subsettings]);
  
  const filteredMainSettings = mainSettings.map(category => ({
    ...category,
    subsettings: category.subsettings.filter(
      (setting) =>
        setting.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        setting.description.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(cat => {
    // Show category if it matches search or has matching subsettings
    return cat.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
           cat.subsettings.length > 0;
  });

  // Show content when a setting is selected (only if showContentInline is true)
  if (showContentInline && selectedSetting && selectedSetting !== "list") {
    const allFlattened = mainSettings.flatMap(cat => cat.subsettings);
    const setting = allFlattened.find((s) => s.id === selectedSetting);
    
    return (
      <div
        className={`h-full flex flex-col ${
          isDark ? "bg-dark-bg" : "bg-white"
        }`}
      >
        {/* Header with back button */}
        <div
          className={`p-4 border-b flex items-center gap-3 flex-shrink-0 ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <button
            onClick={() => onSelectSetting("list")}
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
            {setting?.label}
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

          {selectedSetting === "reset-password" && (
            <RequestPasswordResetComponent isDark={isDark} />
          )}
          {selectedSetting === "change-password" && (
            <ChangePasswordComponent isDark={isDark} />
          )}
        </div>
      </div>
    );
  }

  // Show list view
  return (
    <div
      className={`h-full flex flex-col ${
        isDark ? "bg-dark-bg" : "bg-white"
      }`}
    >
      {/* Search Bar */}
      <div className="p-4 flex-shrink-0">
        <div className="relative">
          <Search
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <input
            type="text"
            placeholder="Search settings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500"
            } focus:outline-none focus:ring-1 focus:ring-green-500`}
          />
        </div>
      </div>

      {/* Settings List with Categories and Subsettings */}
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

        {filteredMainSettings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div
              className={`text-4xl mb-4 ${
                isDark ? "text-gray-600" : "text-gray-400"
              }`}
            >
              ⚙️
            </div>
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No settings found
            </p>
          </div>
        ) : (
          filteredMainSettings.map((category) => (
            <div key={category.id}>
              {/* Category Header */}
              <button
                onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                className={`w-full p-4 border-b text-left cursor-pointer transition-colors flex items-center justify-between ${
                  isDark
                    ? "hover:bg-gray-700 border-gray-700"
                    : "hover:bg-gray-50 border-gray-100"
                }`}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {category.icon && React.createElement(category.icon, {
                    className: `w-5 h-5 flex-shrink-0 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`
                  })}
                  <h3
                    className={`font-medium text-sm ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {category.label}
                  </h3>
                </div>
                <ChevronRight
                  className={`w-5 h-5 flex-shrink-0 transition-transform ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  } ${expandedCategory === category.id ? "rotate-90" : ""}`}
                />
              </button>

              {/* Subsettings */}
              {expandedCategory === category.id && category.subsettings.map((subsetting) => (
                <button
                  key={subsetting.id}
                  onClick={() => onSelectSetting(subsetting.id)}
                  className={`w-full p-4 border-b text-left cursor-pointer transition-colors pl-12 ${
                    isDark
                      ? "hover:bg-gray-700 border-gray-700"
                      : "hover:bg-gray-50 border-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {subsetting.icon && React.createElement(subsetting.icon, {
                      className: `w-4 h-4 flex-shrink-0 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`
                    })}
                    <div className="min-w-0">
                      <h4
                        className={`font-medium text-sm ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {subsetting.label}
                      </h4>
                      <p
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {subsetting.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SettingsMenu;