import React, { useState } from "react";
import axios from "axios";
import { Mail, Send } from "lucide-react";

const ForgotPasswordPage = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "https://split-money-api.vercel.app/auth/request-password-reset",
        { emailOrUsername }
      );
      setMessage(response.data.message);
      setEmailOrUsername("");
    } catch (error) {
      setError(error.response?.data?.error || "Error requesting password reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-auth-back flex items-center justify-center p-4">
      {/* Centered Container */}
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-800 transition-all duration-300">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-700/10 rounded-lg flex-shrink-0">
              <Mail className="w-6 h-6 text-green-700" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-bold text-white">Reset Password</h3>
              <p className="text-sm text-gray-400 mt-1">
                Enter your email or username
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative w-full">
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:border-green-700 transition-all duration-300 focus:shadow-lg focus:shadow-green-700/20"
                placeholder="Email or Username"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-700/50 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              {loading ? "Sending..." : "Request Password Reset"}
            </button>
          </form>

          {/* Messages */}
          {message && (
            <div className="mt-4 p-4 bg-green-700/10 border border-green-700/50 rounded-xl text-green-400 text-center text-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-center text-sm">
              {error}
            </div>
          )}

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <a 
              href="/login" 
              className="text-sm text-gray-400 hover:text-green-700 transition-colors duration-300"
            >
              ← Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;