import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AddExpenseForm = ({ groupId, members, onClose }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState([]);
  const [splitAmongst, setSplitAmongst] = useState([]);
  const [selectedPaidBy, setSelectedPaidBy] = useState([]);
  const [selectedSplitAmongst, setSelectedSplitAmongst] = useState([]);

  const handlePaidByChange = (member, amount) => {
    setSelectedPaidBy((prev) => {
      const updated = prev.filter((item) => item.name !== member.name);
      if (amount > 0) {
        updated.push({ ...member, amount });
      }
      return updated;
    });
  };

  const handleSplitAmongstChange = (member) => {
    setSelectedSplitAmongst((prev) => {
      if (prev.includes(member)) {
        return prev.filter((item) => item.name !== member.name);
      }
      return [...prev, member];
    });
  };

  const validateAndSubmit = async () => {
    const totalPaid = selectedPaidBy.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    if (totalPaid !== parseFloat(amount)) {
      alert('The total amount paid by members must equal the expense amount.');
      return;
    }

    try {
      const token = Cookies.get('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const response = await axios.post(
        `http://localhost:3000/groups/${groupId}/expenses`,
        {
          groupId,
          name,
          amount: parseFloat(amount),
          paidBy: selectedPaidBy,
          splitAmongst: selectedSplitAmongst,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Expense added:', response.data);
      onClose();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Add Expense</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Expense Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded-md bg-gray-800 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Total Amount</label>
          <input
            type="number"
            className="w-full px-3 py-2 rounded-md bg-gray-800 text-white"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Paid By</label>
          {members.map((member) => (
            <div key={member._id} className="flex items-center mb-2">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedPaidBy.some((item) => item.name === member.name)}
                onChange={(e) =>
                  handlePaidByChange(member, e.target.checked ? member.amount : 0)
                }
              />
              <span>{member.name}</span>
              {selectedPaidBy.some((item) => item.name === member.name) && (
                <input
                  type="number"
                  className="ml-2 px-2 py-1 rounded-md bg-gray-800 text-white w-24"
                  placeholder="Amount"
                  value={
                    selectedPaidBy.find((item) => item.name === member.name)?.amount || ''
                  }
                  onChange={(e) =>
                    handlePaidByChange(member, parseFloat(e.target.value) || 0)
                  }
                />
              )}
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Split Amongst</label>
          {members.map((member) => (
            <div key={member._id} className="flex items-center mb-2">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedSplitAmongst.some((item) => item.name === member.name)}
                onChange={() => handleSplitAmongstChange(member)}
              />
              <span>{member.name}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-md mr-4 hover:bg-red-600 transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={validateAndSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
          >
            Add Expense
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseForm;
