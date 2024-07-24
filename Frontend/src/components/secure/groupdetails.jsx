import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

const GroupDetails = () => {
  const { groupId } = useParams();
  const [groupDetails, setGroupDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchGroupDetails = async () => {
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

        setGroupDetails(response.data);
        const userId = JSON.parse(atob(token.split('.')[1])).userId;
        setIsAdmin(response.data.group.admin._id === userId);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching group details:', error);
        setIsLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!groupDetails) {
    return <div>Error loading group details.</div>;
  }

  return (
    <div className="p-4 bg-auth-back h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">{groupDetails.group.name}</h1>
      <p>Admin: {groupDetails.group.admin.name}</p>
      
      <div className="my-4">
        <h2 className="text-xl font-semibold mb-2">Members</h2>
        <ul>
          {groupDetails.group.members.map(member => (
            <li key={member.userId ? member.userId._id : member.name}>
              {member.name} ({member.email || 'No email'})
            </li>
          ))}
        </ul>
      </div>

      <div className="my-4">
        <h2 className="text-xl font-semibold mb-2">Expenses</h2>
        {groupDetails.group.expenses.length === 0 ? (
          <p>No expenses recorded.</p>
        ) : (
          <ul>
            {groupDetails.group.expenses.map(expense => (
              <li key={expense._id}>
                {expense.name}: ${expense.amount}
                <p>Paid by:</p>
                <ul>
                  {expense.paidBy.map(payer => (
                    <li key={payer._id}>{payer.name} - ${payer.amount}</li>
                  ))}
                </ul>
                <p>Split amongst:</p>
                <ul>
                  {expense.splitAmongst.map(participant => (
                    <li key={participant._id}>{participant.name}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="my-4">
        <h2 className="text-xl font-semibold mb-2">Balances</h2>
        {groupDetails.group.balances.length === 0 ? (
          <p>No balances calculated.</p>
        ) : (
          <ul>
            {groupDetails.group.balances.map(balance => (
              <li key={balance._id}>
                {balance.name}: ${balance.balance}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="my-4">
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        {groupDetails.summary.length === 0 ? (
          <p>No summary available.</p>
        ) : (
          <ul>
            {groupDetails.summary.map(item => (
              <li key={`${item.from}-${item.to}`}>
                {item.from} owes {item.to} ${item.amount}
              </li>
            ))}
          </ul>
        )}
      </div>

      {isAdmin && (
        <div className="my-4">
          <h2 className="text-xl font-semibold mb-2">Admin Actions</h2>
          <button className="bg-red-500 text-white px-4 py-2 rounded mb-4">
            Settle Up
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded mb-4">
            Add Expense
          </button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded mb-4">
            Edit Group
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;
