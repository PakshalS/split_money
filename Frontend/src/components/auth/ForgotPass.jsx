import React, { useState } from "react";
import axios from "axios";
import { Mail, Send, Eye, EyeOff } from "lucide-react";
import PageNavigationbar from "../pagenavbar";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <PageNavigationbar />
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-center mb-2">
            <div className="p-3 bg-teal-500/10 rounded-lg">
              <Mail className="w-8 h-8 text-teal-500" />
            </div>
          </div>
          <h2 className="text-white text-2xl text-center font-semibold">Reset Password</h2>
          <p className="text-gray-400 text-center mt-2 text-sm">
            Enter your email or username to receive a password reset link
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-teal-500 focus:outline-none placeholder-gray-500"
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
            className="w-full bg-teal-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-600 flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            {loading ? "Sending..." : "Request Password Reset"}
          </button>
        </form>

        {/* Messages */}
        {message && (
          <div className="mt-4 p-3 bg-teal-500/10 border border-teal-500/50 rounded text-teal-400 text-center text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-center text-sm">
            {error}
          </div>
        )}

        {/* Back to Login Link */}
        <div className="text-center mt-6">
          <Link 
            to="/login" 
            className="text-sm text-gray-400 hover:text-teal-500 transition-colors"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;