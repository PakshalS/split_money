import React, { useState, useCallback, useRef } from "react";
import { UserPlus, Mail } from "lucide-react";
import useStore from "../../../store/useStore";

const SendRequestComponent = ({ onRequestSent, isDark }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const debounceTimerRef = useRef(null);

  // Get store action
  const { sendFriendRequestAsync } = useStore();

  // Debounced submit function
  const debouncedSubmit = useCallback(async (emailValue) => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await sendFriendRequestAsync(emailValue);
      setMessage("Friend request sent successfully!");
      setEmail("");
      if (onRequestSent) onRequestSent();
    } catch (error) {
      setError(error.response?.data?.error || error.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  }, [sendFriendRequestAsync, onRequestSent]);

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
    <div className={`rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-5 border transition-all duration-300 ${
      isDark 
        ? 'bg-gray-900 border-gray-800' 
        :'bg-gray-50 border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
        <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
          isDark ? 'bg-green-700/10' : 'bg-green-100'
        }`}>
          <UserPlus className={`w-5 h-5 sm:w-6 sm:h-6 ${
            isDark ? 'text-green-700' : 'text-green-600'
          }`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-xl sm:text-2xl font-bold truncate ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Send Friend Request</h3>
          <p className={`text-xs sm:text-sm mt-1 ${
            isDark ? 'text-gray-500' : 'text-gray-600'
          }`}>
            Connect with friends by email
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Input wrapper */}
        <div className="relative w-full sm:flex-1">
          <Mail className={`absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <input
            type="email"
            className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 text-sm sm:text-base ${
              isDark
                ? 'border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:border-green-700 focus:shadow-lg focus:shadow-green-700/20'
                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:shadow-lg focus:shadow-green-500/20'
            } focus:outline-none`}
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
          className={`w-full sm:w-auto sm:min-w-[160px] md:min-w-[180px] font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base whitespace-nowrap active:scale-[0.98] ${
            isDark
              ? 'bg-gradient-to-r from-green-700 to-green-600 text-white hover:from-green-600 hover:to-green-500 hover:shadow-green-700/50'
              : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-green-500/50'
          }`}
        >
          {loading ? "Sending..." : "Send Request"}
        </button>
      </form>

      {/* Messages */}
      {message && (
        <div className={`mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg sm:rounded-xl text-center animate-fade-in text-xs sm:text-sm ${
          isDark
            ? 'bg-green-700/10 border border-green-700/50 text-green-700'
            : 'bg-green-50 border border-green-200 text-green-600'
        }`}>
          {message}
        </div>
      )}
      {error && (
        <div className={`mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg sm:rounded-xl text-center animate-fade-in text-xs sm:text-sm ${
          isDark
            ? 'bg-red-500/10 border border-red-500/50 text-red-500'
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          {error}
        </div>
      )}
    </div>
  );
};

export default SendRequestComponent;