import AddExpenseForm from './admin/addexpense';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import SettleUpForm from './admin/settleup';
import GroupEditForm from './admin/editgroup';

const GroupDetails = () => {
  const { groupId } = useParams();
  const [groupDetails, setGroupDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [expandedExpense, setExpandedExpense] = useState(null);
  const [expandedMembers, setExpandedMembers] = useState(false);
  const [expandedBalances, setExpandedBalances] = useState(false);
  const [expandedAdminActions, setExpandedAdminActions] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isSettleUpOpen, setIsSettleUpOpen] = useState(false);
  const [isGroupEditOpen, setIsGroupEditOpen] = useState(false);



  const toggleAddExpenseForm = () => setIsAddExpenseOpen(!isAddExpenseOpen);
  const toggleSettleUpForm = () => setIsSettleUpOpen(!isSettleUpOpen);
  const toggleGroupEditForm = () => setIsGroupEditOpen(!isGroupEditOpen);


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

  const toggleExpense = (expenseId) => {
    setExpandedExpense(expenseId === expandedExpense ? null : expenseId);
  };

  const toggleMembers = () => {
    setExpandedMembers(!expandedMembers);
  };

  const toggleBalances = () => {
    setExpandedBalances(!expandedBalances);
  };

  const toggleAdminActions = () => {
    setExpandedAdminActions(!expandedAdminActions);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (!groupDetails) {
    return <div className="min-h-screen flex items-center justify-center text-white">Error loading group details.</div>;
  }

  return (
    <div className="min-h-screen p-4 bg-auth-back text-white flex flex-col items-center">
      <div className="w-full max-w-3xl bg-gray-950 p-6 rounded-lg shadow-lg mb-8">
        <h1 className="text-3xl font-bold mb-6">{groupDetails.group.name}</h1>
        <p className="mb-4"><span className="font-semibold">Admin:</span> {groupDetails.group.admin.name}</p>
        {isAdmin && (
          <div className="mb-6">
            <button onClick={toggleAdminActions} className="bg-black text-white px-4 py-2 rounded-md hover:text-green-500 transition duration-300 w-full mb-4">
              {expandedAdminActions ? 'Hide Admin Actions' : 'Show Admin Actions'}
            </button>
            {expandedAdminActions && (
              <div className="flex flex-wrap space-y-2 justify-center mb-6">
                <button onClick={toggleSettleUpForm} className="bg-black text-white px-4 py-2 rounded-md hover:text-green-500 transition duration-300">
                  Settle Up
                </button>
                <button onClick={toggleAddExpenseForm} className="bg-black text-white px-4 py-2 rounded-md hover:text-green-500 transition duration-300">
                  Add Expense
                </button>
                <button  onClick={toggleGroupEditForm} className="bg-black text-white px-4 py-2 rounded-md hover:text-green-500 transition duration-300">
                  Edit Group
                </button>
                <button className="bg-black text-white px-4 py-2 rounded-md hover:text-green-500 transition duration-300">
                  Add Member
                </button>
                <button className="bg-black text-white px-4 py-2 rounded-md hover:text-green-500 transition duration-300">
                  Add Friend
                </button>
                <button className="bg-black text-white px-4 py-2 rounded-md hover:text-green-500 transition duration-300">
                  Change Admin
                </button>
              </div>
            )}
                  {isAddExpenseOpen && <AddExpenseForm groupId={groupId} onClose={toggleAddExpenseForm} />}
                  {isSettleUpOpen && <SettleUpForm groupId={groupId} onClose={toggleSettleUpForm} />}
                  {isGroupEditOpen && <GroupEditForm groupId={groupId} onClose={toggleGroupEditForm} />}

          </div>
        )}
      </div>

      <div className="w-full max-w-3xl bg-gray-950 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Summary</h2>
        {groupDetails.summary.length === 0 ? (
          <p>No summary available.</p>
        ) : (
          <ul className="space-y-2">
            {groupDetails.summary.map(item => (
              <li key={`${item.from}-${item.to}`} className="bg-gray-800 p-4 rounded-md shadow-sm">
                <span className="font-semibold">{item.from}</span> owes <span className="font-semibold">{item.to}</span> ${item.amount}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="w-full max-w-3xl bg-gray-950 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Expenses</h2>
        {groupDetails.group.expenses.length === 0 ? (
          <p>No expenses recorded.</p>
        ) : (
          <ul className="space-y-4">
            {groupDetails.group.expenses.map((expense, index) => (
              <li key={expense._id} className="bg-gray-800 p-4 rounded-md shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold">{index + 1}. {expense.name}:</span> ${expense.amount}
                    <div className="mt-2">
                      <button onClick={() => toggleExpense(expense._id)} className="text-sm text-blue-400">
                        {expandedExpense === expense._id ? 'Hide Details' : 'Show Details'}
                      </button>
                      {expandedExpense === expense._id && (
                        <div className="mt-2 transition-all duration-300 ease-in-out">
                          <p className="mb-2">Paid by:</p>
                          <ul className="ml-4">
                            {expense.paidBy.map(payer => (
                              <li key={payer._id}>{payer.name} - ${payer.amount}</li>
                            ))}
                          </ul>
                          <p className="mb-2 mt-2">Split amongst:</p>
                          <ul className="ml-4">
                            {expense.splitAmongst.map(participant => (
                              <li key={participant._id}>{participant.name}</li>
                            ))}
                          </ul>
                          {isAdmin && (
                            <div className="flex space-x-2 mt-4">
                              <button className="bg-yellow-500 text-black px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-300">
                                Edit Expense
                              </button>
                              <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300">
                                Delete Expense
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="w-full max-w-3xl bg-gray-950 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Balances</h2>
        <button onClick={toggleBalances} className="text-sm text-blue-400 mb-2">
          {expandedBalances ? 'Hide Balances' : 'Show Balances'}
        </button>
        {expandedBalances && (
          groupDetails.group.balances.length === 0 ? (
            <p>No balances calculated.</p>
          ) : (
            <ul className="space-y-2 transition-all duration-300 ease-in-out">
              {groupDetails.group.balances.map(balance => (
                <li key={balance._id} className="bg-gray-800 p-4 rounded-md shadow-sm">
                  <span className="font-semibold">{balance.name}:</span> ${balance.balance}
                </li>
              ))}
            </ul>
          )
        )}
      </div>

      <div className="w-full max-w-3xl bg-gray-950 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Members</h2>
        <button onClick={toggleMembers} className="text-sm text-blue-400 mb-2">
          {expandedMembers ? 'Hide Members' : 'Show Members'}
        </button>
        {expandedMembers && (
          <ul className="space-y-2 transition-all duration-300 ease-in-out">
            {groupDetails.group.members.map((member, index) => (
              <li key={member.userId ? member.userId._id : member.name} className="bg-gray-800 p-4 rounded-md shadow-sm overflow-hidden">
                <span className="font-semibold">{index + 1}. {member.name}</span> <span className="block truncate">{member.email || 'No email'}</span>
                {isAdmin && (
                  <button className="bg-red-500 text-white px-3 py-1 rounded-md mt-2 hover:bg-red-600 transition duration-300">
                    Remove Member
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6">
          <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300">
            Leave Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
