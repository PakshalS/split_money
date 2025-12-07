import React, { lazy, Suspense } from "react";
import RequestPasswordResetComponent from "./reqreset";
import ChangePasswordComponent from "./changepass";
import { useOutletContext } from "react-router-dom";

const Navigationbar = lazy(() => import("../../navbar"));

const RequestPasswordReset = ({ isDark: isDarkProp }) => {
  const outletContext = useOutletContext();
  const isDark = isDarkProp ?? outletContext?.isDark ?? false;

  return (
    <div className={`min-h-screen flex flex-col items-center p-4 ${
      isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="w-full max-w-6xl space-y-6">
        {/* Request Password Reset Section */}
        <div className="w-full">
          <RequestPasswordResetComponent isDark={isDark} />
        </div>

        {/* Change Password Section */}
        <div className="w-full">
          <ChangePasswordComponent isDark={isDark} />
        </div>
      </div>
    </div>
  );
};

export default RequestPasswordReset;