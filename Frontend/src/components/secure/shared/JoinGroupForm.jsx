import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../../store/useStore";
import { joinGroup as joinGroupAPI } from "../../../api/groups";

const JoinGroupForm = ({ isDark, onBack }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { fetchGroupDetails, fetchGroups } = useStore();

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
    setError("");
  };

  const handleJoin = async () => {
    if (code.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await joinGroupAPI(code);
      const group = response.group;

      // Refresh groups list
      await fetchGroups();

      // Check if group has strict join enabled
      if (group.strictJoin) {
        // Strict join - request sent
        setSuccessMessage("Join request sent! Waiting for admin approval...");
        setTimeout(() => {
          setCode("");
          setSuccessMessage("");
          onBack();
        }, 2500);
      } else {
        // Easy join - user joined successfully
        await fetchGroupDetails(group._id);
        setSuccessMessage("Successfully joined! Opening group...");
        setTimeout(() => {
          setCode("");
          setSuccessMessage("");
          onBack();
          navigate(`/groups/${group._id}`, { state: { groupName: group.name } });
        }, 1500);
      }
    } catch (err) {
      console.error("Error response from server:", err.response);
      const errorMsg = err.response?.data?.error || err.message || "Failed to join group";
      setError(errorMsg);
      console.error("Error joining group:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading && code.length === 6) {
      handleJoin();
    }
  };

  return (
    <div
      className={`h-full flex flex-col relative ${
        isDark ? "bg-dark-bg" : "bg-gray-100"
      }`}
    >
      {/* Header with Back Button */}
      <div
        className={`p-4 border-b ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <h2
            className={`text-lg font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Join Group
          </h2>
          <button
            onClick={onBack}
            className={`p-2 rounded-full transition-colors ${
              isDark
                ? "hover:bg-gray-700 text-gray-400"
                : "hover:bg-gray-200 text-gray-600"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6">
        {/* Success Message */}
        {successMessage && (
          <div
            className={`p-4 rounded-lg text-sm font-medium text-center ${
              isDark
                ? "bg-green-900/30 text-green-300 border border-green-700"
                : "bg-green-50 text-green-600 border border-green-200"
            }`}
          >
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            className={`p-4 rounded-lg text-sm font-medium text-center ${
              isDark
                ? "bg-red-900/30 text-red-300 border border-red-700"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}
          >
            {error}
          </div>
        )}

        {/* Info Text */}
        <div>
          <p
            className={`text-sm text-center ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Enter the 6-digit group code that the group admin shared with you to join.
          </p>
        </div>

        {/* Code Input */}
        <div className="space-y-3">
          <label
            className={`block text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Group Code
          </label>
          <input
            type="text"
            placeholder="000000"
            value={code}
            onChange={handleCodeChange}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            maxLength="6"
            inputMode="numeric"
            className={`w-full px-6 py-4 rounded-lg border text-center text-5xl tracking-widest font-mono font-bold transition-colors ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-green-500"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-500"
            } focus:outline-none focus:ring-1 focus:ring-green-500 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
          <p
            className={`text-xs text-center ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {code.length}/6 digits entered
          </p>
        </div>

      </div>

      {/* Footer Button */}
      <div
        className={`px-6 py-4 border-t ${
          isDark ? "border-gray-700" : "border-gray-200"
        } flex gap-3`}
      >
        <button
          onClick={onBack}
          disabled={isLoading}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
            isDark
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-900"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Cancel
        </button>
        <button
          onClick={handleJoin}
          disabled={isLoading || code.length !== 6}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            isLoading || code.length !== 6
              ? isDark
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              : isDark
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Joining...
            </>
          ) : (
            "Join Group"
          )}
        </button>
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

export default JoinGroupForm;
