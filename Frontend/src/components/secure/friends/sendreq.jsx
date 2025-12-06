import React, { useState, useCallback, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { UserPlus, Mail } from "lucide-react";

const SendRequestComponent = ({ onRequestSent }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const debounceTimerRef = useRef(null);

  const token = Cookies.get("authToken");

  // Debounced submit function
  const debouncedSubmit = useCallback(async (emailValue) => {
    if (!token) {
      setError("No auth token found");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await axios.post(
        "https://split-money-api.vercel.app/friends/send",
        { email: emailValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Friend request sent successfully!");
      setEmail("");
      if (onRequestSent) onRequestSent();
    } catch (error) {
      setError(error.response?.data?.error || "Failed to send request");
    } finally {
      setLoading(false);
    }
  }, [token, onRequestSent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debouncing
    debounceTimerRef.current = setTimeout(() => {
      debouncedSubmit(email);
    }, 300); // 300ms debounce
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-5 shadow-2xl border border-gray-800 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
        <div className="p-1.5 sm:p-2 bg-green-700/10 rounded-lg flex-shrink-0">
          <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl sm:text-2xl font-bold text-white truncate">Send Friend Request</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Connect with friends by email
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Input wrapper */}
        <div className="relative w-full sm:flex-1">
          <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          <input
            type="email"
            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:border-green-700 transition-all duration-300 focus:shadow-lg focus:shadow-green-700/20 text-sm sm:text-base"
            placeholder="Friend's Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto sm:min-w-[160px] md:min-w-[180px] bg-gradient-to-r from-green-700 to-green-600 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:text-black text-sm sm:text-base whitespace-nowrap active:scale-[0.98]"
        >
          {loading ? "Sending..." : "Send Request"}
        </button>
      </form>

      {/* Messages */}
      {message && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-green-700/10 border border-green-700/50 rounded-lg sm:rounded-xl text-green-700 text-center animate-fade-in text-xs sm:text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-500/10 border border-red-500/50 rounded-lg sm:rounded-xl text-red-500 text-center animate-fade-in text-xs sm:text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default SendRequestComponent;