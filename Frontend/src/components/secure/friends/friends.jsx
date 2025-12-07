import React, { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import SendRequestComponent from "./sendreq";
import RequestListComponent from "./reqlist";
import FriendListComponent from "./managefriends";
import { FriendManagementSkeleton } from "./friendsloader";
import { useOutletContext } from "react-router-dom";

const Navigationbar = lazy(() => import("../../navbar"));

const FriendManagement = ({ isDark: isDarkProp}) => {
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const outletContext = useOutletContext();
  const isDark = isDarkProp ?? outletContext?.isDark ?? false;
  const token = Cookies.get("authToken");

  const fetchRequests = async () => {
    try {
      const response = await axios.get("https://split-money-api.vercel.app/friends/get-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setRequests([]);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await axios.get("https://split-money-api.vercel.app/friends/get-friends", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFriends(response.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
      setFriends([]);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchRequests(), fetchFriends()]);
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  const handleRequestSent = () => {
    fetchRequests();
  };

  const handleRequestResponded = () => {
    fetchRequests();
    fetchFriends();
  };

  const handleFriendRemoved = () => {
    fetchFriends();
  };

  if (loading) {
    return (
      <Suspense fallback={<FriendManagementSkeleton isDark={isDark} />}>
        <FriendManagementSkeleton isDark={isDark}/>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<FriendManagementSkeleton isDark={isDark}/>}>
      <div className={`min-h-screen flex flex-col items-center p-4 ${
        isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="w-full max-w-6xl space-y-6">
          {/* Send Request Section */}
          <div className="w-full">
            <SendRequestComponent isDark={isDark} onRequestSent={handleRequestSent} />
          </div>

          {/* Two Column Layout for Requests and Friends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Requests */}
            <div className="w-full">
              <RequestListComponent 
                requests={requests} 
                isDark={isDark}
                onRequestResponded={handleRequestResponded} 
              />
            </div>

            {/* Friends List */}
            <div className="w-full">
              <FriendListComponent 
                friends={friends} 
                isDark={isDark}
                onFriendRemoved={handleFriendRemoved} 
              />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default FriendManagement;