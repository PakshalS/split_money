// AddMemberForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AddMemberForm = ({ groupId, onClose }) => {
  const [members, setMembers] = useState([{ name: '', email: '' }]);
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

      
    const handleMemberChange = (index, field, value) => {
        const newMembers = [...members];
        newMembers[index][field] = value;
        setMembers(newMembers);
      };
    
      const addMember = () => setMembers([...members, { name: '', email: '' }]);
    
      const removeMember = (index) => {
        const newMembers = members.filter((_, i) => i !== index);
        setMembers(newMembers);
      };
    
      const handleFriendSelect = (friend) => {
        const existingIndex = memberr.findIndex(
          (member) => member.email === friend.email
        );
    
        if (existingIndex !== -1) {
          return; // Friend already selected, do nothing
        }
    
        setMembers([...members, { name: friend.name, email: friend.email || '' }]);
      };


      const handleSubmit = async () => {
        try {
          const hasEmptyName = members.some(member => !member.name.trim());
          if (hasEmptyName) {
            alert('All member names are required.');
            return;
          }
    
          const token = Cookies.get('authToken');
          if (!token) {
            console.error('No auth token found');
            return;
          }
    
          await axios.put('http://localhost:3000/groups/${groupId}/add-friend', {
            groupId,
            members,
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          alert('Members added successfully!');
          onClose();
        } catch (error) {
          console.error('Error adding members:', error);
        }
      };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-md shadow-md w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-white">&times;</button>
        <h2 className="text-xl font-bold mb-4 text-white">Add Member</h2>
        {members.map((member, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 w-full"
            >
              <input
                type="text"
                placeholder="Member Name"
                value={member.name}
                onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                className="flex-1 p-3 rounded-md border-2 border-gray-600 bg-black text-white focus:outline-none focus:border-green-500"
              />
              <input
                type="email"
                placeholder="Email (Optional)"
                value={member.email}
                onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                className="flex-1 p-3 rounded-md border-2 border-gray-600 bg-black text-white focus:outline-none focus:border-green-500"
              />
              <button
                onClick={() => removeMember(index)}
                className="mt-2 sm:mt-0 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={addMember}
            className="w-full h-14 mb-4 px-4 py-2 bg-black text-white rounded-md hover:text-green-500 transition duration-300"
          >
            Add Member
          </button>
          <div className="w-full mt-6">
            <h3 className="text-xl font-semibold mb-4">Friends</h3>
            <div className="flex flex-wrap gap-4">
              {friends.map((friend) => (
                <div key={friend._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    onChange={() => handleFriendSelect(friend)}
                    className="form-checkbox h-5 w-5 text-green-500"
                  />
                  <label>{friend.name}</label>
                </div>
              ))}
            </div>
          </div>
        <button onClick={handleSubmit} className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700">Settle Up</button>
      </div>
    </div>
  );
};

export default AddMemberForm;
