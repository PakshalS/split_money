import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Lock, Key, Eye, EyeOff } from "lucide-react";

const ChangePasswordComponent = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    // Client-side validation
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (oldPassword === newPassword) {
      setError("New password must be different from old password");
      setLoading(false);
      return;
    }

    try {
      const token = Cookies.get("authToken");

      if (!token) {
        setError("No authentication token found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "https://split-money-api.vercel.app/auth/change-password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(response.data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Password change error:", error);

      if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError(error.response?.data?.error || "Error changing password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl p-4 sm:p-5 md:p-6 shadow-2xl border border-gray-800">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-1.5 sm:p-2 bg-green-700/10 rounded-lg">
          <Key className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">Change Password</h3>
          <p className="text-xs sm:text-sm text-gray-400">Update your account password</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleChange} className="space-y-3 sm:space-y-4">
        {/* Old Password */}
        <div className="relative">
          <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 z-10" />
          <input
            type={showOldPassword ? "text" : "password"}
            className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border-2 border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:border-green-700 focus:outline-none transition-all"
            placeholder="Old Password (Temporary Password)"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowOldPassword(!showOldPassword)}
            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            {showOldPassword ? (
              <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>

        {/* New Password */}
        <div className="relative">
          <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 z-10" />
          <input
            type={showNewPassword ? "text" : "password"}
            className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border-2 border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:border-green-700 focus:outline-none transition-all"
            placeholder="New Password (min. 6 characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={loading}
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            {showNewPassword ? (
              <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-700 to-green-800 text-white font-semibold py-2.5 sm:py-3 text-sm sm:text-base rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-green-700/50 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Key className="w-4 h-4 sm:w-5 sm:h-5" />
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>

      {/* Messages */}
      {message && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-green-700/10 border border-green-700/50 rounded-xl text-green-400 text-center text-xs sm:text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-center text-xs sm:text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default ChangePasswordComponent;