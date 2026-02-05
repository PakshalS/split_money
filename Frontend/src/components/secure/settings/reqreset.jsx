import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Mail, Send, AlertTriangle, ArrowRight } from "lucide-react";
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
    <div className="h-full flex flex-col relative max-w-2xl mx-auto">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col py-8 px-4 sm:px-0">
        
        {/* Icon & Title */}
        <div className="flex flex-col gap-4 mb-8">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isDark ? 'bg-green-900/20 text-green-500' : 'bg-green-100 text-green-600'
          }`}>
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Reset Password
            </h3>
            <p className={`text-sm mt-2 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              We will send a temporary password to your registered email address. 
              Use that password to log in and set a new one.
            </p>
          </div>
        </div>

        {/* Warning Section (Open Layout) */}
        {!showConfirm && !message && (
          <div className="mb-8">
            <div className="flex gap-3">
              <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                isDark ? 'text-yellow-500' : 'text-yellow-600'
              }`} />
              <div className="space-y-1">
                <p className={`text-sm font-medium ${isDark ? 'text-yellow-500' : 'text-yellow-700'}`}>
                  Important Note
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  This will immediately invalidate your current password. The email will be sent to <span className="font-mono font-bold text-current">{maskedEmail}</span>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Area */}
        <div className="mt-auto sm:mt-0">
          {showConfirm ? (
            <div className={`p-6 rounded-2xl ${
              isDark ? 'bg-gray-800/50' : 'bg-gray-100'
            }`}>
              <p className={`text-sm font-medium mb-6 text-center ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Are you sure you want to proceed?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={loading}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                    isDark 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordReset}
                  disabled={loading}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 disabled:opacity-50 flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      Confirm <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              disabled={loading || !userEmail}
              className={`w-full sm:w-auto py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg flex items-center justify-center gap-2 text-sm active:scale-[0.98] ${
                isDark 
                  ? 'bg-green-600 text-white hover:bg-green-500 shadow-green-900/20' 
                  : 'bg-green-600 text-white hover:bg-green-700 shadow-green-500/20'
              }`}
            >
              <Send className="w-4 h-4" />
              Request Reset Link
            </button>
          )}
        </div>

        {/* Feedback Messages */}
        {message && (
          <div className={`mt-6 flex items-start gap-3 p-4 rounded-xl ${
            isDark ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-700'
          }`}>
            <Send className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{message}</p>
          </div>
        )}
        
        {error && (
          <div className={`mt-6 flex items-start gap-3 p-4 rounded-xl ${
            isDark ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'
          }`}>
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default RequestPasswordResetComponent;