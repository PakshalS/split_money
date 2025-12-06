import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // ADD THIS IMPORT
import { Mail, Send, AlertTriangle } from "lucide-react";
import { jwtDecode } from "jwt-decode";

const RequestPasswordResetComponent = () => {
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
        "https://split-money-api.vercel.app/auth/request-password-reset",
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
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl border border-gray-800 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
        <div className="p-1.5 sm:p-2 bg-green-700/10 rounded-lg flex-shrink-0">
          <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Request Password Reset
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Send temporary password to your registered email
          </p>
        </div>
      </div>

      {/* Warning Box */}
      {!showConfirm && (
        <div className="mb-4 p-3 sm:p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg sm:rounded-xl">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-yellow-500 text-xs sm:text-sm font-semibold">
                Be Careful!
              </p>
              <p className="text-yellow-500/80 text-xs sm:text-sm mt-1">
                This will send a temporary password to <span className="font-mono font-bold">{maskedEmail}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation State */}
      {showConfirm ? (
        <div className="space-y-3">
          <p className="text-white text-sm sm:text-base text-center">
            Are you sure you want to reset your password?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={loading}
              className="flex-1 bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg sm:rounded-xl transition-all duration-300 hover:bg-gray-600 disabled:opacity-50 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordReset}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-700 to-green-600 text-white font-semibold py-3 px-4 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:text-black flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.98]"
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
          className="w-full bg-gradient-to-r from-green-700 to-green-800 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:text-black flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.98]"
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          Request Password Reset
        </button>
      )}

      {/* Messages */}
      {message && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-green-700/10 border border-green-700/50 rounded-lg sm:rounded-xl text-green-700 text-center text-xs sm:text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-500/10 border border-red-500/50 rounded-lg sm:rounded-xl text-red-500 text-center text-xs sm:text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default RequestPasswordResetComponent;