import React, { useState } from "react";
import { Check, X, Clock, User } from "lucide-react";
import useStore from "../../../store/useStore";

const RequestListComponent = ({ requests = [], onRequestResponded, isDark }) => {
  const [loadingId, setLoadingId] = useState(null); // Track which request is processing

  const { respondToRequestAsync } = useStore();

  const handleRespond = async (requesterId, action) => {
    setLoadingId(requesterId);
    try {
      await respondToRequestAsync(requesterId, action);
      if (onRequestResponded) onRequestResponded();
    } catch (error) {
      console.error("Failed to respond to request", error);
      // Optional: Add toast notification here
    } finally {
      setLoadingId(null);
    }
  };

  // Helper to get initials
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <div className="h-full flex flex-col relative">
      
      {/* Header / Info Bar (Matches Search Bar area style) */}
      <div className={`p-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
        <div className="flex items-center gap-2">
           <div className={`p-2 rounded-lg ${isDark ? 'bg-[#1f2329] text-white' : 'bg-gray-300 text-black'}`}>
              <Clock className="w-4 h-4" />
           </div>
           <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {requests.length === 0 ? "No pending requests" : `${requests.length} pending request${requests.length !== 1 ? 's' : ''}`}
           </span>
        </div>
      </div>

      {/* Requests List */}
      <div className="flex-1 overflow-y-auto -mx-2 px-2 scrollbar-hide">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 sm:h-60 text-center">
            <div className={`p-3 rounded-full mb-3 ${isDark ? 'bg-[#1f2329]' : 'bg-gray-300'}`}>
              <Clock className={`w-6 h-6 ${isDark ? 'text-white' : 'text-black'}`} />
            </div>
            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              No pending requests
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {requests.map((request) => {
              const isProcessing = loadingId === request.requester._id;
              
              return (
                <div
                  key={request._id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors group ${
                    isDark 
                      ? 'hover:bg-[#1f2329]' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {getInitials(request.requester.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {request.requester.name}
                    </h3>
                    {request.requester.email && (
                      <p className={`text-xs truncate mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {request.requester.email}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {isProcessing ? (
                       <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>...</span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleRespond(request.requester._id, "accepted")}
                          className={`p-2 rounded-full transition-all ${
                            isDark 
                              ? 'text-green-500 hover:bg-green-900/30' 
                              : 'text-green-600 hover:bg-green-100'
                          }`}
                          title="Accept"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleRespond(request.requester._id, "rejected")}
                          className={`p-2 rounded-full transition-all ${
                            isDark 
                              ? 'text-red-500 hover:bg-red-900/30' 
                              : 'text-red-600 hover:bg-red-100'
                          }`}
                          title="Reject"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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