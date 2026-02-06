import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { joinGroup } from "../api/groups";
import useStore from "../store/useStore";

const JoinViaLink = () => {
  const { joinCode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success", "pending", "error"
  const { fetchGroupDetails } = useStore();

  useEffect(() => {
    const handleJoin = async () => {
      try {
        setLoading(true);

        // Call the joinGroup API
        const response = await joinGroup(joinCode);
        const { group } = response;
        const groupId = group._id;

        // Refresh group details
        await fetchGroupDetails(groupId, true);

        if (group.strictJoin) {
          // If strict join is enabled, show pending message
          setMessageType("pending");
          setMessage("✓ Join request sent! Waiting for admin approval...");

          // After 2.5 seconds, navigate to home
          setTimeout(() => {
            navigate("/home");
          }, 2500);
        } else {
          // If easy join, show success and navigate to group
          setMessageType("success");
          setMessage("✓ Successfully joined! Opening group...");

          // After 1.5 seconds, navigate to group details
          setTimeout(() => {
            navigate(`/groups/${groupId}`);
          }, 1500);
        }
      } catch (error) {
        const errorMsg = error.response?.data?.error || error.message || "Failed to join group";
        
        // Check if already a member
        if (errorMsg.includes("already a member") || errorMsg.includes("already in this group")) {
          setMessageType("info");
          setMessage("You're already a member of this group. Redirecting...");
          
          // Try to find and navigate to the group
          setTimeout(() => {
            navigate("/home");
          }, 1500);
        } else {
          setMessageType("error");
          setMessage(`❌ ${errorMsg}`);

          // After 3 seconds, navigate back to home
          setTimeout(() => {
            navigate("/home");
          }, 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    if (joinCode) {
      handleJoin();
    }
  }, [joinCode, navigate, fetchGroupDetails]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-slate-800 rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 border border-slate-700">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-600 border-t-green-500"></div>
            <div className="text-center">
              <p className="text-slate-300 font-semibold text-lg">Joining group...</p>
              <p className="text-slate-400 text-sm mt-2">Please wait</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            {messageType === "success" && (
              <>
                <div className="text-5xl">✓</div>
                <p className="text-green-400 font-semibold text-lg">{message}</p>
              </>
            )}

            {messageType === "pending" && (
              <>
                <div className="text-5xl">⏳</div>
                <p className="text-yellow-400 font-semibold text-lg">{message}</p>
                <p className="text-slate-400 text-sm">You'll be notified once approved</p>
              </>
            )}

            {messageType === "error" && (
              <>
                <div className="text-5xl">⚠️</div>
                <p className="text-red-400 font-semibold text-lg">{message}</p>
                <p className="text-slate-400 text-sm">Redirecting to home...</p>
              </>
            )}

            {messageType === "info" && (
              <>
                <div className="text-5xl">ℹ️</div>
                <p className="text-blue-400 font-semibold text-lg">{message}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinViaLink;
