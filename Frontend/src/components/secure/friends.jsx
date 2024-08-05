import React, { useEffect, useCallback,useState, lazy, Suspense } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { debounce } from "lodash";

const Navigationbar = lazy(() => import("../navbar"));

const FriendManagement = () => {
  const [email, setEmail] = useState("");
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = Cookies.get("authToken");

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:3000/friends/get-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(response.data);
    } catch (error) {
      setError("No friend request found");
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await axios.get("http://localhost:3000/friends/get-friends", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFriends(response.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const debouncedFetchRequests = useCallback(debounce(fetchRequests, 300), [token]);

  useEffect(() => {
    if (token) {
      fetchRequests();
      fetchFriends();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      console.error("No auth token found");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/friends/send",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Friend request sent successfully!");
      setEmail(""); // Clear the input field after sending
      debouncedFetchRequests(); // Refresh requests after sending
    } catch (error) {
      console.error("Error sending request", error);
      alert("Failed to send request.");
    }
  };

  const respondToRequest = async (requesterId, action) => {
    try {
      await axios.post(
        "http://localhost:3000/friends/respond",
        { requesterId, action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchRequests(); // Refresh requests after response
      fetchFriends(); // Refresh friends list after response
    } catch (error) {
      setError("Failed to respond to friend request");
    }
  };

  const removeFriend = async (friendId) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/friends/${friendId}/remove`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFriends(friends.filter((friend) => friend._id !== friendId));
      setSelectedFriend(null); // Reset selected friend
      setLoading(false);
    } catch (error) {
      console.error("Error removing friend:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-16 lg:mt-20 bg-auth-back text-white flex flex-col items-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <Navigationbar />
      </Suspense>
      <div className="w-full max-w-3xl bg-gray-950 shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Send Friend Request</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            className="w-full p-2 border bg-gray-700 border-gray-600 rounded text-white"
            placeholder="Recipient's Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded transition duration-300"
          >
            Send Request
          </button>
        </form>
      </div>

      <div className="w-full max-w-3xl bg-gray-950 shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Pending Friend Requests</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <ul className="space-y-4">
          {requests.map((request) => (
            <li key={request._id} className="bg-gray-800 p-4 rounded-md">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setSelectedRequest(selectedRequest === request._id ? null : request._id)}
              >
                <span className="font-semibold text-white">{request.requester.name}</span>
                <span className="block truncate text-gray-400">{request.requester.email || "No email"}</span>
              </div>
              {selectedRequest === request._id && (
                <div className="mt-2 flex flex-wrap space-y-2 md:space-x-2 justify-center">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-300 w-full md:w-1/2"
                    onClick={() => respondToRequest(request.requester._id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300 w-full md:w-1/2"
                    onClick={() => respondToRequest(request.requester._id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full max-w-3xl bg-gray-950 shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Friends List</h2>
        <ul className="space-y-4">
          {friends.map((friend) => (
            <li key={friend._id} className="bg-gray-800 p-4 rounded-md">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setSelectedFriend(friend._id === selectedFriend ? null : friend._id)}
              >
                <p className="text-white">{friend.name}</p>
                <span className="text-blue-500 text-sm">{selectedFriend === friend._id ? "Close" : "Options"}</span>
              </div>
              {selectedFriend === friend._id && (
                <div className="mt-2">
                  <button
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-700 transition duration-300 w-full"
                    onClick={() => removeFriend(friend._id)}
                    disabled={loading}
                  >
                    {loading ? "Removing..." : "Remove Friend"}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FriendManagement;
