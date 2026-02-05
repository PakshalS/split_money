import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Mail, Send, AlertTriangle } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { API_ENDPOINTS } from '../../../config/api';

const RequestPasswordResetComponent = ({ isDark }) => {
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    try {
      const token = Cookies.get('authToken');
      if (token) {
        const decoded = jwtDecode(token);
        setUserEmail(decoded.email || "");
      }
    } catch (err) {
      console.error("Token decode error:", err);
      setError("Unable to retrieve user information");
    }
  }, []);

  const handlePasswordReset = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        API_ENDPOINTS.AUTH.REQUEST_PASSWORD_RESET,
        { emailOrUsername: userEmail }
      );
      setMessage(response.data.message);
      setShowConfirm(false);
    } catch (error) {
      setError(error.response?.data?.error || "Error requesting password reset");
    } finally {
      setLoading(false);
    }
  };

  const maskedEmail = userEmail
    ? userEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3")
    : "your registered email";

  return (
    <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border transition-all duration-300 ${
      isDark 
        ? 'bg-gray-900 border-gray-800' 
        :'bg-gray-50 border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
        <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
          isDark ? 'bg-green-700/10' : 'bg-green-100'
        }`}>
          <Mail className={`w-5 h-5 sm:w-6 sm:h-6 ${
            isDark ? 'text-green-700' : 'text-green-600'
          }`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-xl sm:text-2xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Request Password Reset
          </h3>
          <p className={`text-xs sm:text-sm mt-1 ${
            isDark ? 'text-gray-500' : 'text-gray-600'
          }`}>
            Send temporary password to your registered email
          </p>
        </div>
      </div>

      {/* Warning Box */}
      {!showConfirm && (
        <div className={`mb-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border ${
          isDark 
            ? 'bg-yellow-500/10 border-yellow-500/30' 
            : 'bg-yellow-50 border-yellow-300'
        }`}>
          <div className="flex items-start gap-2">
            <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              isDark ? 'text-yellow-500' : 'text-yellow-600'
            }`} />
            <div className="flex-1">
              <p className={`text-xs sm:text-sm font-semibold ${
                isDark ? 'text-yellow-500' : 'text-yellow-700'
              }`}>
                Be Careful!
              </p>
              <p className={`text-xs sm:text-sm mt-1 ${
                isDark ? 'text-yellow-500/80' : 'text-yellow-600'
              }`}>
                This will send a temporary password to <span className="font-mono font-bold">{maskedEmail}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation State */}
      {showConfirm ? (
        <div className="space-y-3">
          <p className={`text-sm sm:text-base text-center ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Are you sure you want to reset your password?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={loading}
              className={`flex-1 font-semibold py-3 px-4 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 text-sm sm:text-base ${
                isDark 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordReset}
              disabled={loading}
              className={`flex-1 bg-gradient-to-r font-semibold py-3 px-4 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.98] ${
                isDark 
                  ? 'from-green-700 to-green-600 text-white hover:text-black' 
                  : 'from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600'
              }`}
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              {loading ? "Sending..." : "Confirm"}
            </button>
          </div>
        </div>
      ) : (
        /* Main Button */
        <button
          onClick={() => setShowConfirm(true)}
          disabled={loading || !userEmail}
          className={`w-full bg-gradient-to-r font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.98] ${
            isDark 
              ? 'from-green-700 to-green-800 text-white hover:text-black' 
              : 'from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600'
          }`}
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          Request Password Reset
        </button>
      )}

      {/* Messages */}
      {message && (
        <div className={`mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border text-center text-xs sm:text-sm ${
          isDark 
            ? 'bg-green-700/10 border-green-700/50 text-green-700' 
            : 'bg-green-50 border-green-300 text-green-700'
        }`}>
          {message}
        </div>
      )}
      {error && (
        <div className={`mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border text-center text-xs sm:text-sm ${
          isDark 
            ? 'bg-red-500/10 border-red-500/50 text-red-500' 
            : 'bg-red-50 border-red-300 text-red-600'
        }`}>
          {error}
        </div>
      )}
    </div>
  );
};

export default RequestPasswordResetComponent;