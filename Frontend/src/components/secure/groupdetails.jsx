import React, { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { debounce } from "lodash";

// Lazy load the components
const AddExpenseForm = lazy(() => import("./admin/addexpense"));
const SettleUpForm = lazy(() => import("./admin/settleup"));
const GroupEditForm = lazy(() => import("./admin/editgroup"));
const EditExpenseForm = lazy(() => import("./admin/editexpense"));
const DeleteExpenseForm = lazy(() => import("./admin/deleteexpense"));
const RemoveMemberForm = lazy(() => import("./admin/removemember"));
const AddMemberForm = lazy(() => import("./admin/addmember"));
const ChangeAdminForm = lazy(() => import("./admin/changeadmin"));

const GroupDetails = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [message1, setMessage1] = useState("");
  const [error1, setError1] = useState("");
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [groupDetails, setGroupDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [expandedExpense, setExpandedExpense] = useState(null);
  const [expandedMembers, setExpandedMembers] = useState(false);
  const [expandedBalances, setExpandedBalances] = useState(false);
  const [expandedTransactionHistory, setExpandedTransactionHistory] =
    useState(false);
  const [expandedAdminActions, setExpandedAdminActions] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isSettleUpOpen, setIsSettleUpOpen] = useState(false);
  const [isGroupEditOpen, setIsGroupEditOpen] = useState(false);
  const [isOpenAddMember, setIsOpenAddMember] = useState(false);
  const [isEditExpenseOpen, setIsEditExpenseOpen] = useState(false);
  const [isDeleteExpenseOpen, setIsDeleteExpenseOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isRemoveMemberOpen, setIsRemoveMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isChangeAdminOpen, setIsChangeAdminOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);



  const fetchGroupDetails = async () => {
    if (isDeleted) return;
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        console.error("No auth token found");
        return;
      }

      const response = await axios.get(
        `https://split-money-api.vercel.app/groups/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
      setError("");
      setGroupDetails(response.data);
      const userId = JSON.parse(atob(token.split(".")[1])).userId;
      setIsAdmin(response.data.group.admin._id === userId);

      setIsLoading(false);
    } catch (error) {
      setMessage("");
      setError(error.response.data.error || "Error fetching group details:");
      console.error("Error fetching group details:", error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!isDeleted) {
      fetchGroupDetails();
    }
  }, [groupId, isDeleted]);

  const debouncedFetchGroupDetails = debounce(() => {
    if (!isDeleted) {
      fetchGroupDetails();
    }
  }, 300);

  const toggleEditExpenseForm = (expense) => {
    setSelectedExpense(expense);
    setIsEditExpenseOpen(!isEditExpenseOpen);
  };
  const toggleDeleteExpenseForm = (expense) => {
    setSelectedExpense(expense);
    setIsDeleteExpenseOpen(!isDeleteExpenseOpen);
  };
  const toggleRemoveMemberForm = (member) => {
    setSelectedMember(member);
    setIsRemoveMemberOpen(!isRemoveMemberOpen);
  };
  const toggleAddExpenseForm = () => setIsAddExpenseOpen(!isAddExpenseOpen);
  const toggleSettleUpForm = () => setIsSettleUpOpen(!isSettleUpOpen);
  const toggleGroupEditForm = () => setIsGroupEditOpen(!isGroupEditOpen);
  const toggleChangeAdminForm = () => setIsChangeAdminOpen(!isChangeAdminOpen);
  const toggleAddMemberForm = () => setIsOpenAddMember(!isOpenAddMember);

  const toggleExpense = (expenseId) => {
    setExpandedExpense(expenseId === expandedExpense ? null : expenseId);
  };

  const toggleMembers = () => setExpandedMembers(!expandedMembers);
  const toggleBalances = () => setExpandedBalances(!expandedBalances);
  const toggleTransactionHistory = () =>
    setExpandedTransactionHistory(!expandedTransactionHistory);
  const toggleAdminActions = () =>
    setExpandedAdminActions(!expandedAdminActions);

  const handleLeave = async () => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        console.error("No auth token found");
        return;
      }
      if (confirm("Are you sure you want to leave ?")) {
        await axios.delete(`https://split-money-api.vercel.app/groups/${groupId}/leave`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage1(response.data.message);
        setError1("");
        alert("Left Group successfully!");
        debouncedFetchGroupDetails();
      }
    } catch (error) {
      console.error("Error leaving:", error);
      setMessage1("");
      setError1(error.response?.data?.error || 'Error leaving');
    }
  };

  useEffect(() => {
    const unblock = navigate.apply((tx) => {
      if (tx.location.pathname !== window.location.pathname) {
        tx.retry();
      }
    });
    return unblock;
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!groupDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Error loading group details.
      </div>
    );
  }

  if (isDeleted) return null;

  const handleback =()=>{
  navigate('/home');
  }

  return (
    <div className="min-h-screen p-4 bg-auth-back text-white flex flex-col items-center">
      <div className="w-full max-w-3xl bg-gray-950 p-6 rounded-lg shadow-lg mb-8">
        <h1 className="text-3xl font-bold mb-6">{groupDetails.group.name}</h1>
        <p className="mb-4">
          <span className="font-semibold">Admin:</span>{" "}
          {groupDetails.group.admin.name}
        </p>
        <button 
        onClick={handleback}
        className="bg-black text-white px-4 py-2 rounded-md hover:text-green-500 transition duration-300 w-full mb-4"
        >Go back</button>
        {isAdmin && (
          <div className="mb-6">
            <button
              onClick={toggleAdminActions}
              className="bg-black text-white px-4 py-2 rounded-md hover:text-green-500 transition duration-300 w-full mb-4"
            >
              {expandedAdminActions
                ? "Hide Admin Actions"
                : "Show Admin Actions"}
            </button>
            {expandedAdminActions && (
              <div className="flex flex-wrap space-y-2 md:space-x-4 justify-center mb-6">
                <button
                  onClick={toggleSettleUpForm}
                  className="bg-black text-white px-4 py-2 rounded-md hover:text-green-500 transition duration-300"
                >
                  Settle Up
                </button>
                <button
                  onClick={toggleAddExpenseForm}
                  className="bg-black text-white px-4 py-2 rounded-md hover:text-green-500 transition duration-300"
                >
                  Add Expense
                </button>
                <button
                  onClick={toggleGroupEditForm}
                  className="bg-black text-white px-4 py-2 rounded-md hover:text-green-500 transition duration-300"
                >
                  Edit Group
                </button>
                <button
                  onClick={toggleAddMemberForm}
                  className="bg-black text-white px-4 py-2 rounded-md hover:text-green-500 transition duration-300"
                >
                  Add Member
                </button>
                <button
                  onClick={toggleChangeAdminForm}
                  className="bg-black text-white px-4 py-2 rounded-md hover:text-green-500 transition duration-300"
                >
                  Change Admin
                </button>
              </div>
            )}
            {isAddExpenseOpen && (
              <Suspense fallback={<div>Loading...</div>}>
                <AddExpenseForm
                  groupId={groupId}
                  onClose={() => {
                    toggleAddExpenseForm();
                    debouncedFetchGroupDetails();
                  }}
                />
              </Suspense>
            )}
            {isOpenAddMember && (
              <Suspense fallback={<div>Loading...</div>}>
                <AddMemberForm
                  groupId={groupId}
                  onClose={() => {
                    toggleAddMemberForm();
                    debouncedFetchGroupDetails();
                  }}
                />
              </Suspense>
            )}
            {isSettleUpOpen && (
              <Suspense fallback={<div>Loading...</div>}>
                <SettleUpForm
                  groupId={groupId}
                  onClose={() => {
                    toggleSettleUpForm();
                    debouncedFetchGroupDetails();
                  }}
                />
              </Suspense>
            )}
            {isGroupEditOpen && (
              <Suspense fallback={<div>Loading...</div>}>
                <GroupEditForm
                  groupId={groupId}
                  setIsDeleted={setIsDeleted} 
                  onClose={() => {
                    toggleGroupEditForm();
                    debouncedFetchGroupDetails();
                  }}
                />
              </Suspense>
            )}
            {isChangeAdminOpen && (
              <Suspense fallback={<div>Loading...</div>}>
                <ChangeAdminForm
                  groupId={groupId}
                  onClose={() => {
                    toggleChangeAdminForm();
                    debouncedFetchGroupDetails();
                  }}
                />
              </Suspense>
            )}
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl bg-gray-950 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Summary</h2>
        {groupDetails.summary.length === 0 ? (
          <p>No summary available.</p>
        ) : (
          <ul className="space-y-2">
            {groupDetails.summary.map((item) => (
              <li
                key={`${item.from}-${item.to}`}
                className="bg-gray-800 p-4 rounded-md shadow-sm"
              >
                <span className="font-semibold">{item.from}</span> owes{" "}
                <span className="font-semibold">{item.to}</span> ${item.amount}
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
              <li
                key={expense._id}
                className="bg-gray-800 p-4 rounded-md shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold">
                      {index + 1}. {expense.name}:
                    </span>{" "}
                    ${expense.amount}
                    <div className="mt-2">
                      <button
                        onClick={() => toggleExpense(expense._id)}
                        className="text-sm text-blue-400"
                      >
                        {expandedExpense === expense._id
                          ? "Hide Details"
                          : "Show Details"}
                      </button>
                      {expandedExpense === expense._id && (
                        <div className="mt-2 transition-all duration-300 ease-in-out">
                          <p className="mb-2">Paid by:</p>
                          <ul className="ml-4">
                            {expense.paidBy.map((payer) => (
                              <li key={payer._id}>
                                {payer.name} - ${payer.amount}
                              </li>
                            ))}
                          </ul>
                          <p className="mb-2 mt-2">Split amongst:</p>
                          <ul className="ml-4">
                            {expense.splitAmongst.map((participant) => (
                              <li key={participant._id}>{participant.name}</li>
                            ))}
                          </ul>
                          {isAdmin && (
                            <div className="flex space-x-2 mt-4">
                              <button
                                onClick={() => toggleEditExpenseForm(expense)}
                                className="bg-yellow-500 text-black px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-300"
                              >
                                Edit Expense
                              </button>
                              <button
                                onClick={() => toggleDeleteExpenseForm(expense)}
                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
                              >
                                Delete Expense
                              </button>
                              {isEditExpenseOpen && (
                                <Suspense fallback={<div>Loading...</div>}>
                                  <EditExpenseForm
                                    groupId={groupId}
                                    expense={selectedExpense}
                                    onClose={() => {
                                      toggleEditExpenseForm();
                                      debouncedFetchGroupDetails();
                                    }}
                                  />
                                </Suspense>
                              )}
                              {isDeleteExpenseOpen && (
                                <Suspense fallback={<div>Loading...</div>}>
                                  <DeleteExpenseForm
                                    groupId={groupId}
                                    expense={selectedExpense}
                                    onClose={() => {
                                      toggleDeleteExpenseForm();
                                      debouncedFetchGroupDetails();
                                    }}
                                  />
                                </Suspense>
                              )}
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
          {expandedBalances ? "Hide Balances" : "Show Balances"}
        </button>
        {expandedBalances &&
          (groupDetails.group.balances.length === 0 ? (
            <p>No balances calculated.</p>
          ) : (
            <ul className="space-y-2 transition-all duration-300 ease-in-out">
              {groupDetails.group.balances.map((balance) => (
                <li
                  key={balance._id}
                  className="bg-gray-800 p-4 rounded-md shadow-sm"
                >
                  <span className="font-semibold">{balance.name}:</span> $
                  {balance.balance}
                </li>
              ))}
            </ul>
          ))}
      </div>
      <div className="w-full max-w-3xl bg-gray-950 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Settle Ups</h2>
        <button
          onClick={toggleTransactionHistory}
          className="text-sm text-blue-400 mb-2"
        >
          {expandedTransactionHistory ? "Hide History" : "Show History"}
        </button>
        {expandedTransactionHistory &&
          (groupDetails.group.transactionHistory.length === 0 ? (
            <p>No transactions recorded.</p>
          ) : (
            <ul className="space-y-2 transition-all duration-300 ease-in-out">
              {groupDetails.group.transactionHistory.map((transaction) => (
                <li
                  key={transaction._id}
                  className="bg-gray-800 p-4 rounded-md shadow-sm"
                >
                  <p>
                    <span className="font-semibold">
                      {transaction.payer.name}
                    </span>{" "}
                    settled with{" "}
                    <span className="font-semibold">
                      {transaction.receiver.name}
                    </span>{" "}
                    for{" "}
                    <span className="font-semibold">${transaction.amount}</span>
                    .
                  </p>
                </li>
              ))}
            </ul>
          ))}
      </div>

      <div className="w-full max-w-3xl bg-gray-950 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Members</h2>
        <button onClick={toggleMembers} className="text-sm text-blue-400 mb-2">
          {expandedMembers ? "Hide Members" : "Show Members"}
        </button>
        {expandedMembers && (
          <ul className="space-y-2 transition-all duration-300 ease-in-out">
            {groupDetails.group.members.map((member, index) => (
              <li
                key={member.name}
                className="bg-gray-800 p-4 rounded-md shadow-sm overflow-hidden"
              >
                <span className="font-semibold">
                  {index + 1}. {member.name}
                </span>{" "}
                <span className="block truncate">
                  {member.email || "No email"}
                </span>
                {isAdmin && (
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => toggleRemoveMemberForm(member)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300 "
                    >
                      Remove
                    </button>
                    {isRemoveMemberOpen &&
                      selectedMember._id === member._id && (
                        <Suspense fallback={<div>Loading...</div>}>
                          <RemoveMemberForm
                            groupId={groupId}
                            member={selectedMember}
                            onClose={() => {
                              toggleRemoveMemberForm();
                              debouncedFetchGroupDetails();
                            }}
                          />
                        </Suspense>
                      )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={handleLeave}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
        >
          Leave Group
        </button>
        {message1 && <p className="text-green-500 mt-4">{message1}</p>}
        {error1 && <p className="text-red-500 mt-4">{error1}</p>}
      </div>
      {message && <p className="text-green-500 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default GroupDetails;