import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
 
const FriendList = () => {
    const [friends, setFriends] = useState([]);


    useEffect(() => {
        const fetchFriends = async () => {
          try {
            const token = Cookies.get('authToken');
            if (!token) {
              console.error('No auth token found');
              return;
            }
    
            const response = await axios.get('http://localhost:3000/friends/get-friends', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setFriends(response.data);
          } catch (error) {
            console.error('Error fetching friends:', error);
          }
        };
    
        fetchFriends();
      }, []);
  return (
    <div className="p-4 bg-gray-950 shadow-md rounded-md">
      <h2 className="text-lg font-semibold mb-2 text-white">Friends List</h2>
      <ul className="list-disc list-inside">
      {friends.map((friend) => (
                <div key={friend._id} className="flex items-center space-x-2">
                  
                  <label className="text-white">{friend.name}</label>
                </div>
              ))}
      </ul>
    </div>
  );
};

export default FriendList;
