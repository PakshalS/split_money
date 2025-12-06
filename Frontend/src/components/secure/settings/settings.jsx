import React, { lazy, Suspense } from "react";
import RequestPasswordResetComponent from "./reqreset";
import ChangePasswordComponent from "./changepass";

const Navigationbar = lazy(() => import("../../navbar"));

const RequestPasswordReset = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-4 pt-24">

      <div className="w-full max-w-6xl space-y-6">
        {/* Request Password Reset Section */}
        <div className="w-full">
          <RequestPasswordResetComponent />
        </div>

        {/* Change Password Section */}
        <div className="w-full">
          <ChangePasswordComponent />
        </div>
      </div>
    </div>
  );
};

export default RequestPasswordReset;