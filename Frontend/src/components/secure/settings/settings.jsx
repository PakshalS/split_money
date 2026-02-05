import React, { useState } from "react";
import RequestPasswordResetComponent from "./reqreset";
import ChangePasswordComponent from "./changepass";
import { useOutletContext } from "react-router-dom";
import SettingsMenu from "./SettingsMenu";

const RequestPasswordReset = ({ 
  isDark: isDarkProp,
  selectedSetting: propSelectedSetting,
  onSelectSetting: propOnSelectSetting,
  isInSidebar = false
}) => {
  const outletContext = useOutletContext();
  const isDark = isDarkProp ?? outletContext?.isDark ?? false;
  
  // Use prop-based state if provided (from layout), otherwise use local state
  const [localSelectedSetting, setLocalSelectedSetting] = useState("reset-password");
  const selectedSetting = propSelectedSetting !== undefined ? propSelectedSetting : localSelectedSetting;
  const handleSelectSetting = propOnSelectSetting !== undefined ? propOnSelectSetting : setLocalSelectedSetting;

  // When in sidebar mode, just show the menu (which handles both list and content views)
  if (isInSidebar) {
    return (
      <SettingsMenu
        isDark={isDark}
        selectedSetting={selectedSetting}
        onSelectSetting={handleSelectSetting}
      />
    );
  }

  // Original two-panel layout for non-sidebar mode

  // Original two-panel layout for non-sidebar mode (when used directly as a page)
  return (
    <div
      className={`h-full flex ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Settings Menu - Left Side */}
      <div
        className={`hidden md:block w-80 h-full flex-shrink-0 ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border-r overflow-hidden`}
      >
        <SettingsMenu
          isDark={isDark}
          selectedSetting={selectedSetting}
          onSelectSetting={handleSelectSetting}
        />
      </div>

      {/* Divider */}
      <div
        className={`hidden md:block w-px flex-shrink-0 ${
          isDark ? "bg-gray-700" : "bg-gray-300"
        }`}
      />

      {/* Settings Content - Right Side */}
      <div
        className={`flex-1 h-full overflow-y-auto ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        {/* Mobile: Show menu */}
        <div className="md:hidden h-full">
          <SettingsMenu
            isDark={isDark}
            selectedSetting={selectedSetting}
            onSelectSetting={handleSelectSetting}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestPasswordReset;