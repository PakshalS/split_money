import React, { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import SendRequestComponent from "./sendreq";
import RequestListComponent from "./reqlist";
import FriendListComponent from "./managefriends";
import { FriendManagementSkeleton } from "./friendsloader";

const Navigationbar = lazy(() => import("../../navbar"));

const FriendManagement = () => {
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <Suspense fallback={<FriendManagementSkeleton />}>
        <FriendManagementSkeleton />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<FriendManagementSkeleton />}>
      <div className="min-h-screen bg-gray-950 pt-24 text-white flex flex-col items-center p-4">
        <div className="w-full max-w-6xl space-y-6">
          {/* Send Request Section */}
          <div className="w-full">
            <SendRequestComponent onRequestSent={handleRequestSent} />
          </div>

          {/* Two Column Layout for Requests and Friends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Requests */}
            <div className="w-full">
              <RequestListComponent 
                requests={requests} 
                onRequestResponded={handleRequestResponded} 
              />
            </div>

            {/* Friends List */}
            <div className="w-full">
              <FriendListComponent 
                friends={friends} 
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