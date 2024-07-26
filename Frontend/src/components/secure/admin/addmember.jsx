// AddMemberForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AddMemberForm = ({ groupId, onClose }) => {
    const [memberr, setMembers] = useState([{ name: '', email: '' }]);
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
            memberr,
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
        <h2 className="text-xl font-bold mb-4 text-white">Settle Up</h2>
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-white">Payer</h3>
          <select
            value={payer}
            onChange={(e) => setPayer(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-600 rounded bg-gray-700 text-white"
          >
            <option value="">Select Payer</option>
            {members.map((member, index) => (
              <option key={index} value={member.name}>{member.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-white">Receiver</h3>
          <select
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-600 rounded bg-gray-700 text-white"
          >
            <option value="">Select Receiver</option>
            {members.map((member, index) => (
              <option key={index} value={member.name}>{member.name}</option>
            ))}
          </select>
        </div>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value >= 0 ? e.target.value : '')}
          className="w-full mb-4 p-2 border border-gray-600 rounded bg-gray-700 text-white"
        />
        <button onClick={handleSettleUp} className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700">Settle Up</button>
      </div>
    </div>
  );
};

export default AddMemberForm;
