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
      fetchRequests();
    } catch (error) {
      setError('Failed to respond to friend request');
    }
  };

  return (
    <div className="p-4 bg-gray-950 shadow-md rounded-md">
      <h2 className="text-lg font-semibold mb-2 text-white">Pending Friend Requests</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-4">
        {requests.map((request) => (
          <li key={request._id} className="bg-gray-100 p-4 rounded-md flex justify-between items-center">
            <div>
              <p className="font-bold">{request.requester.name}</p>
              <p>{request.requester.email}</p>
            </div>
            <div className="flex space-x-2">
              <button
                className="bg-black hover:text-green-500  text-white px-4 py-2 rounded"
                onClick={() => respondToRequest(request.requester._id, 'accepted')}
              >
                Accept
              </button>
              <button
                className="bg-black hover:text-green-500 text-white px-4 py-2 rounded"
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
