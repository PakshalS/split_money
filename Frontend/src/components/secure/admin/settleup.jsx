import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const SettleUpForm = ({ groupId, onClose }) => {
  const [payer, setPayer] = useState('');
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = Cookies.get('authToken');
        if (!token) {
          console.error('No auth token found');
          return;
        }

        const response = await axios.get(`https://split-money-api.onrender.com/groups/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMembers(response.data.group.members);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, [groupId]);

  const handleSettleUp = async () => {
    if (parseFloat(amount) <= 0) {
      alert('The amount must be greater than zero.');
      return;
    }

    if (!payer || !receiver || payer === receiver) {
      alert('Please select both a payer and a receiver, and they must be different.');
      return;
    }

    try {
      const token = Cookies.get('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      await axios.post(`https://split-money-api.onrender.com/groups/${groupId}/settleup`, {
        groupId,
        payer: { name: payer },
        receiver: { name: receiver },
        amount,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Settlement recorded successfully!');
      onClose();
    } catch (error) {
      console.error('Error recording settlement:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-950 p-6 rounded-md shadow-md w-96 relative">
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
        <button onClick={handleSettleUp} className="bg-gray-900 text-white px-4 py-2 rounded hover:text-green-500">Settle Up</button>
      </div>
    </div>
  );
};

export default SettleUpForm;
