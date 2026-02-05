import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Lock, Key, Eye, EyeOff } from "lucide-react";
import { API_ENDPOINTS } from '../../../config/api';

const ChangePasswordComponent = ({ isDark }) => {
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
        API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
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
    <div className={`rounded-xl p-4 sm:p-5 md:p-6  border ${
      isDark 
        ? 'bg-gray-900 border-gray-800' 
        :'bg-gray-50 border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className={`p-1.5 sm:p-2 rounded-lg ${
          isDark ? 'bg-green-700/10' : 'bg-green-100'
        }`}>
          <Key className={`w-5 h-5 sm:w-6 sm:h-6 ${
            isDark ? 'text-green-700' : 'text-green-600'
          }`} />
        </div>
        <div>
          <h3 className={`text-xl sm:text-2xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Change Password
          </h3>
          <p className={`text-xs sm:text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Update your account password
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleChange} className="space-y-3 sm:space-y-4">
        {/* Old Password */}
        <div className="relative">
          <Lock className={`absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 z-10 ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <input
            type={showOldPassword ? "text" : "password"}
            className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border-2 focus:outline-none transition-all ${
              isDark 
                ? 'border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:border-green-700' 
                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500'
            }`}
            placeholder="Old Password (Temporary Password)"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowOldPassword(!showOldPassword)}
            className={`absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 transition-colors ${
              isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
            }`}
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
          <Lock className={`absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 z-10 ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <input
            type={showNewPassword ? "text" : "password"}
            className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border-2 focus:outline-none transition-all ${
              isDark 
                ? 'border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:border-green-700' 
                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500'
            }`}
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
            className={`absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 transition-colors ${
              isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
            }`}
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
          className={`w-full bg-gradient-to-r font-semibold py-2.5 sm:py-3 text-sm sm:text-base rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${
            isDark 
              ? 'from-green-700 to-green-800 text-white hover:shadow-green-700/50' 
              : 'from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 hover:shadow-green-500/50'
          }`}
        >
          <Key className="w-4 h-4 sm:w-5 sm:h-5" />
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>

      {/* Messages */}
      {message && (
        <div className={`mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl border text-center text-xs sm:text-sm ${
          isDark 
            ? 'bg-green-700/10 border-green-700/50 text-green-400' 
            : 'bg-green-50 border-green-300 text-green-700'
        }`}>
          {message}
        </div>
      )}
      {error && (
        <div className={`mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl border text-center text-xs sm:text-sm ${
          isDark 
            ? 'bg-red-500/10 border-red-500/50 text-red-400' 
            : 'bg-red-50 border-red-300 text-red-600'
        }`}>
          {error}
        </div>
      )}
    </div>
  );
};

export default ChangePasswordComponent;