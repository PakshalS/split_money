
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const PendingFriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = Cookies.get('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const response = await axios.get('http://localhost:3000/friends/get-requests', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(response.data);
    } catch (error) {
      setError('No friend request found');
    }
  };

  const respondToRequest = async (requesterId, action) => {
    try {
      const token = Cookies.get('authToken');
      await axios.post('http://localhost:3000/friends/respond', {
        requesterId,
        action,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchRequests(); // Refresh requests after response
    } catch (error) {
      setError('Failed to respond to friend request');
    }
  };

  return (
    <div className="w-full max-w-md bg-gray-950 shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4 text-white">Pending Friend Requests</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ul className="space-y-4">
        {requests.map((request) => (
          <li key={request._id} className="bg-gray-700 p-4 rounded-md flex justify-between items-center">
            <div>
              <p className="font-bold text-white">{request.requester.name}</p>
              <p className="text-gray-300">{request.requester.email}</p>
            </div>
            <div className="flex space-x-2">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => respondToRequest(request.requester._id, 'accepted')}
              >
                Accept
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => respondToRequest(request.requester._id, 'rejected')}
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingFriendRequests;
