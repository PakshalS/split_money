import React, { useState, useCallback, useRef } from "react";
import { UserPlus, Mail, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";
import useStore from "../../../store/useStore";

const SendRequestComponent = ({ onRequestSent, isDark }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const debounceTimerRef = useRef(null);

  const { sendFriendRequestAsync } = useStore();

  const debouncedSubmit = useCallback(async (emailValue) => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await sendFriendRequestAsync(emailValue);
      setMessage("Request sent successfully!");
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
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      debouncedSubmit(email);
    }, 300);
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
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Add a Friend
            </h3>
            <p className={`text-sm mt-2 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Expand your network. Enter your friend's email address to send them an invitation.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div className="space-y-2">
            <label className={`text-xs font-semibold uppercase tracking-wider ${
              isDark ? 'text-gray-500' : 'text-gray-500'
            }`}>
              Email Address
            </label>
            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                type="email"
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border text-sm transition-all outline-none ${
                  isDark
                    ? 'bg-[#1f2329] border-gray-700 text-white placeholder-gray-500 focus:border-green-600 focus:ring-1 focus:ring-green-600'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500'
                }`}
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading || !email}
            className={`w-full sm:w-auto mt-4 py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg flex items-center justify-center gap-2 text-sm active:scale-[0.98] ${
              isDark
                ? 'bg-[#1f2329] text-white hover:bg-gray-800 disabled:bg-gray-800 disabled:text-gray-500'
                : 'bg-gray-400 text-white hover:bg-gray-500 disabled:bg-gray-200 disabled:text-gray-400'
            }`}
          >
            {loading ? "Sending..." : (
              <>
                Send Invite <ArrowRight className="w-4 h-4" />
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

export default SendRequestComponent;