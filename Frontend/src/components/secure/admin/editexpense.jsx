import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const EditExpenseForm = ({ groupId, onClose }) => {
  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState('');
  const [members, setMembers] = useState([]);
  const [paidBy, setPaidBy] = useState([]);
  const [splitAmongst, setSplitAmongst] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = Cookies.get('authToken');
        if (!token) {
          console.error('No auth token found');
          return;
        }

        const response = await axios.get(`http://localhost:3000/groups/${groupId}`, {
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

  const handleEditExpense = async () => {
    const totalPaid = paidBy.reduce((sum, member) => sum + parseFloat(member.amount || 0), 0);
    if (totalPaid !== parseFloat(amount)) {
      alert('Total amount paid by members must equal the specified amount.');
      return;
    }

    if (splitAmongst.length === 0) {
      alert('Please select at least one person to split the expense.');
      return;
    }

    if (parseFloat(amount) <= 0) {
      alert('The total amount must be greater than zero.');
      return;
    }

    try {
      const token = Cookies.get('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      await axios.post(`http://localhost:3000/groups/${groupId}/expenses`, {
        name: expenseName,
        amount,
        paidBy,
        splitAmongst,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Expense added successfully!');
      onClose();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleAmountChange = (e, member, type) => {
    const value = parseFloat(e.target.value);
    if (value < 0) {
      alert('Amount cannot be negative.');
      return;
    }

    if (type === 'paidBy') {
      const newPaidBy = paidBy.map(p =>
        p.name === member.name ? { ...p, amount: value } : p
      );
      setPaidBy(newPaidBy);
    }
    // Add similar logic for splitAmongst if necessary
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-md shadow-md w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-white">&times;</button>
        <h2 className="text-xl font-bold mb-4 text-white">Add Expense</h2>
        <input
          type="text"
          placeholder="Expense Name"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-600 rounded bg-gray-700 text-white"
        />
        <input
          type="number"
          placeholder="Total Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value >= 0 ? e.target.value : '')}
          className="w-full mb-4 p-2 border border-gray-600 rounded bg-gray-700 text-white"
        />
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-white">Paid By</h3>
          {members.map((member, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={!!paidBy.find(p => p.name === member.name)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setPaidBy([...paidBy, { ...member, amount: 0 }]);
                  } else {
                    setPaidBy(paidBy.filter(p => p.name !== member.name));
                  }
                }}
              />
              <span className="ml-2 text-white">{member.name}</span>
              {paidBy.find(p => p.name === member.name) && (
                <input
                  type="number"
                  placeholder="Amount"
                  value={paidBy.find(p => p.name === member.name)?.amount || ''}
                  onChange={(e) => handleAmountChange(e, member, 'paidBy')}
                  className="ml-4 p-1 border border-gray-600 rounded bg-gray-700 text-white w-20"
                />
              )}
            </div>
          ))}
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-white">Split Amongst</h3>
          {members.map((member, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={!!splitAmongst.find(p => p.name === member.name)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSplitAmongst([...splitAmongst, member]);
                  } else {
                    setSplitAmongst(splitAmongst.filter(p => p.name !== member.name));
                  }
                }}
              />
              <span className="ml-2 text-white">{member.name}</span>
            </div>
          ))}
        </div>
        <button onClick={handleAddExpense} className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700">Add Expense</button>
      </div>
    </div>
  );
};

export default EditExpenseForm;
