import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Lock, Key, Eye, EyeOff, CheckCircle, AlertTriangle, Save } from "lucide-react";
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
    <div className="h-full flex flex-col relative max-w-2xl mx-auto">
      
      {/* Content Area */}
      <div className="flex-1 flex flex-col py-8 px-4 sm:px-0">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-8">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isDark ? 'bg-[#1f2329] text-white' : 'bg-gray-300 text-black'
          }`}>
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Change Password
            </h3>
            <p className={`text-sm mt-2 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Update your password to keep your account secure. Use a mix of characters for better security.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleChange} className="flex flex-col gap-6">
          
          <div className="space-y-2">
            <label className={`text-xs font-semibold uppercase tracking-wider ${
              isDark ? 'text-gray-500' : 'text-gray-500'
            }`}>
              Current Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                type={showOldPassword ? "text" : "password"}
                className={`w-full pl-12 pr-12 py-3.5 rounded-xl border text-sm transition-all outline-none ${
                  isDark
                    ? 'bg-[#1f2329] border-gray-700 text-white placeholder-gray-500 focus:border-green-600 focus:ring-1 focus:ring-green-600'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500'
                }`}
                placeholder="Enter current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                  isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className={`text-xs font-semibold uppercase tracking-wider ${
              isDark ? 'text-gray-500' : 'text-gray-500'
            }`}>
              New Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                type={showNewPassword ? "text" : "password"}
                className={`w-full pl-12 pr-12 py-3.5 rounded-xl border text-sm transition-all outline-none ${
                  isDark
                    ? 'bg-[#1f2329] border-gray-700 text-white placeholder-gray-500 focus:border-green-600 focus:ring-1 focus:ring-green-600'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500'
                }`}
                placeholder="Min. 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                  isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto mt-4 py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg flex items-center justify-center gap-2 text-sm active:scale-[0.98] ${
              isDark
                ? 'bg-[#1f2329] text-white hover:bg-gray-800 disabled:bg-gray-800 disabled:text-gray-500'
                : 'bg-gray-400 text-white hover:bg-gray-500 disabled:bg-gray-200 disabled:text-gray-400'
            }`}
          >
            {loading ? "Updating..." : (
              <>
                <Save className="w-4 h-4" /> Update Password
              </>
            )}
          </button>

        </form>

        {/* Feedback Messages */}
        {message && (
          <div className={`mt-6 flex items-start gap-3 p-4 rounded-xl ${
            isDark ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-700'
          }`}>
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}
        
        {error && (
          <div className={`mt-6 flex items-start gap-3 p-4 rounded-xl ${
            isDark ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'
          }`}>
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ChangePasswordComponent;