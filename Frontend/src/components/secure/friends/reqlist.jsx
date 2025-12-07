import React, { useState, useCallback, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Clock, Check, X } from "lucide-react";

const RequestListComponent = ({ requests, onRequestResponded, isDark }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceTimerRef = useRef(null);

  const token = Cookies.get("authToken");

  const respondToRequest = useCallback(async (requesterId, action) => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce the API call
    debounceTimerRef.current = setTimeout(async () => {
      setLoading(true);
      setError("");
      
      try {
        await axios.post(
          "https://split-money-api.vercel.app/friends/respond",
          { requesterId, action },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSelectedRequest(null);
        if (onRequestResponded) onRequestResponded();
      } catch (error) {
        setError(error.response?.data?.error || "Failed to respond to friend request");
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [token, onRequestResponded]);

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
          <Clock className={`w-5 h-5 sm:w-6 sm:h-6 ${
            isDark ? 'text-green-700' : 'text-green-600'
          }`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-xl sm:text-2xl font-bold truncate ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Pending Requests</h3>
          <p className={`text-xs sm:text-sm mt-1 ${
            isDark ? 'text-gray-500' : 'text-gray-600'
          }`}>
            {requests.length === 0 ? "No pending requests" : `${requests.length} request(s) awaiting response`}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={`mb-3 sm:mb-4 p-3 sm:p-4 rounded-lg sm:rounded-xl text-center text-xs sm:text-sm ${
          isDark
            ? 'bg-red-500/10 border border-red-500/50 text-red-500'
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          {error}
        </div>
      )}

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className={`text-center py-8 sm:py-12 ${
          isDark ? 'text-gray-500' : 'text-gray-400'
        }`}>
          <Clock className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 opacity-30" />
          <p className="text-base sm:text-lg">No pending requests</p>
          <p className="text-xs sm:text-sm mt-2">You'll see friend requests here</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto scrollbar-hide">
          {requests.map((request) => {
            const isSelected = selectedRequest === request._id;
            return (
              <div
                key={request._id}
                className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${
                  isSelected
                    ? (isDark 
                        ? 'bg-green-700/10 border-green-700 shadow-lg shadow-green-700/20' 
                        : 'bg-green-50 border-green-500 shadow-lg shadow-green-500/20')
                    : (isDark 
                        ? 'bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:bg-gray-900' 
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100')
                }`}
              >
                <div
                  className="flex justify-between items-center cursor-pointer gap-2"
                  onClick={() => setSelectedRequest(isSelected ? null : request._id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm sm:text-base font-medium truncate ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{request.requester.name}</p>
                    <p className={`text-xs sm:text-sm truncate ${
                      isDark ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      {request.requester.email || "No email"}
                    </p>
                  </div>
                  <span className={`text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                    isDark ? 'text-green-700' : 'text-green-600'
                  }`}>
                    {isSelected ? "Close" : "Respond"}
                  </span>
                </div>

                {isSelected && (
                  <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2">
                    <button
                      className={`flex-1 font-semibold px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base active:scale-[0.98] ${
                        isDark
                          ? 'bg-green-700 hover:bg-green-600 text-white hover:shadow-green-700/50'
                          : 'bg-green-500 hover:bg-green-600 text-white hover:shadow-green-500/50'
                      }`}
                      onClick={() => respondToRequest(request.requester._id, "accepted")}
                      disabled={loading}
                    >
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      {loading ? "Processing..." : "Accept"}
                    </button>
                    <button
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base active:scale-[0.98]"
                      onClick={() => respondToRequest(request.requester._id, "rejected")}
                      disabled={loading}
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      {loading ? "Processing..." : "Reject"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default RequestListComponent;