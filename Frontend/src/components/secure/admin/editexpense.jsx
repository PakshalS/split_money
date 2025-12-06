// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";

// const EditExpenseForm = ({ groupId, expense, onClose }) => {
//   const [expenseName, setExpenseName] = useState(expense.name || "");
//   const [amount, setAmount] = useState(expense.amount || 0);
//   const [members, setMembers] = useState([]);
//   const [paidBy, setPaidBy] = useState(expense.paidBy || []);
//   const [splitAmongst, setSplitAmongst] = useState(expense.splitAmongst || []);

//   useEffect(() => {
//     const fetchMembers = async () => {
//       try {
//         const token = Cookies.get("authToken");
//         if (!token) {
//           console.error("No auth token found");
//           return;
//         }

//         const response = await axios.get(
//           `https://split-money-api.vercel.app/groups/${groupId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setMembers(response.data.group.members);
//       } catch (error) {
//         console.error("Error fetching members:", error);
//       }
//     };

//     fetchMembers();
//   }, [groupId]);

//   const handleUpdateExpense = async () => {
//     const totalPaid = paidBy.reduce(
//       (sum, member) => sum + parseFloat(member.amount || 0),
//       0
//     );
//     if (totalPaid !== parseFloat(amount)) {
//       alert("Total amount paid by members must equal the specified amount.");
//       return;
//     }

//     if (splitAmongst.length === 0) {
//       alert("Please select at least one person to split the expense.");
//       return;
//     }

//     if (parseFloat(amount) <= 0) {
//       alert("The total amount must be greater than zero.");
//       return;
//     }

//     try {
//       const token = Cookies.get("authToken");
//       if (!token) {
//         console.error("No auth token found");
//         return;
//       }

//       await axios.put(
//         `https://split-money-api.vercel.app/groups/${groupId}/expenses/${expense._id}`,
//         {
//           name: expenseName,
//           amount,
//           paidBy,
//           splitAmongst,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert("Expense updated successfully!");
//       onClose();
//     } catch (error) {
//       console.error("Error updating expense:", error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//       <div className="bg-gray-800 p-6 rounded-md shadow-md w-96 relative">
//         <button onClick={onClose} className="absolute top-2 right-2 text-white">
//           &times;
//         </button>
//         <h2 className="text-xl font-bold mb-4 text-white">Edit Expense</h2>
//         <input
//           type="text"
//           placeholder="Expense Name"
//           value={expenseName}
//           onChange={(e) => setExpenseName(e.target.value)}
//           className="w-full mb-4 p-2 border border-gray-600 rounded bg-gray-700 text-white"
//         />
//         <input
//           type="number"
//           placeholder="Total Amount"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value >= 0 ? e.target.value : "")}
//           className="w-full mb-4 p-2 border border-gray-600 rounded bg-gray-700 text-white"
//         />
//         <div className="mb-4">
//           <h3 className="font-semibold mb-2 text-white">Paid By</h3>
//           {members.map((member, index) => (
//             <div key={index} className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 checked={!!paidBy.find((p) => p.name === member.name)}
//                 onChange={(e) => {
//                   if (e.target.checked) {
//                     setPaidBy([...paidBy, { ...member, amount: 0 }]);
//                   } else {
//                     setPaidBy(paidBy.filter((p) => p.name !== member.name));
//                   }
//                 }}
//               />
//               <span className="ml-2 text-white">{member.name}</span>
//               {paidBy.find((p) => p.name === member.name) && (
//                 <input
//                   type="number"
//                   placeholder="Amount"
//                   value={
//                     paidBy.find((p) => p.name === member.name)?.amount || ""
//                   }
//                   onChange={(e) => {
//                     const value = parseFloat(e.target.value);
//                     if (value < 0) {
//                       alert("Amount cannot be negative.");
//                       return;
//                     }
//                     const newPaidBy = paidBy.map((p) =>
//                       p.name === member.name ? { ...p, amount: value } : p
//                     );
//                     setPaidBy(newPaidBy);
//                   }}
//                   className="ml-4 p-1 border border-gray-600 rounded bg-gray-700 text-white w-20"
//                 />
//               )}
//             </div>
//           ))}
//         </div>
//         <div className="mb-4">
//           <h3 className="font-semibold mb-2 text-white">Split Amongst</h3>
//           {members.map((member, index) => (
//             <div key={index} className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 checked={!!splitAmongst.find((p) => p.name === member.name)}
//                 onChange={(e) => {
//                   if (e.target.checked) {
//                     setSplitAmongst([...splitAmongst, member]);
//                   } else {
//                     setSplitAmongst(
//                       splitAmongst.filter((p) => p.name !== member.name)
//                     );
//                   }
//                 }}
//               />
//               <span className="ml-2 text-white">{member.name}</span>
//             </div>
//           ))}
//         </div>
//         <button
//           onClick={handleUpdateExpense}
//           className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700"
//         >
//           Update Expense
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EditExpenseForm;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Edit, X, Users, IndianRupee, CheckCircle } from 'lucide-react';

const EditExpenseForm = ({ groupId, expense, onClose }) => {
  const [expenseName, setExpenseName] = useState(expense.name || "");
  const [amount, setAmount] = useState(expense.amount || 0);
  const [members, setMembers] = useState([]);
  const [paidBy, setPaidBy] = useState(expense.paidBy || []);
  const [splitAmongst, setSplitAmongst] = useState(expense.splitAmongst || []);
  const [isPaidEqually, setIsPaidEqually] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
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

        setMembers(response.data.group.members);
      } catch (error) {
        console.error("Error fetching members:", error);
        setError('Failed to fetch members');
      }
    };

    fetchMembers();
  }, [groupId]);

  const handlePaidEqually = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount first.');
      return;
    }

    const totalAmount = parseFloat(amount);
    const equalShare = (totalAmount / members.length).toFixed(2);
    
    const equalPaidBy = members.map(member => ({
      ...member,
      amount: parseFloat(equalShare)
    }));
    
    setPaidBy(equalPaidBy);
    setSplitAmongst(members);
    setIsPaidEqually(true);
  };

  const handleUpdateExpense = async () => {
    const totalPaid = paidBy.reduce(
      (sum, member) => sum + parseFloat(member.amount || 0),
      0
    );
    const totalAmount = parseFloat(amount);

    if (Math.abs(totalPaid - totalAmount) > 0.01) {
      setError('Total amount paid by members must equal the specified amount.');
      return;
    }

    if (splitAmongst.length === 0) {
      setError('Please select at least one person to split the expense.');
      return;
    }

    if (totalAmount <= 0) {
      setError('The total amount must be greater than zero.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = Cookies.get("authToken");
      if (!token) {
        console.error("No auth token found");
        return;
      }

      await axios.put(
        `https://split-money-api.vercel.app/groups/${groupId}/expenses/${expense._id}`,
        {
          name: expenseName,
          amount,
          paidBy,
          splitAmongst,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Expense updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating expense:", error);
      setError(error.response?.data?.error || 'Failed to update expense');
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (e, member) => {
    const value = parseFloat(e.target.value);
    if (value < 0) {
      alert('Amount cannot be negative.');
      return;
    }

    const newPaidBy = paidBy.map(p =>
      p.name === member.name ? { ...p, amount: value } : p
    );
    setPaidBy(newPaidBy);
  };

  const handleSplitEqually = () => {
    setSplitAmongst(members);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-800 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 sm:p-5 md:p-6 flex items-center justify-between rounded-t-xl sm:rounded-t-2xl z-50 shadow-xl">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 bg-yellow-500/10 rounded-lg flex-shrink-0">
              <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white truncate">Edit Expense</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg transition-colors duration-300 flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Expense Name */}
          <div>
            <label className="text-gray-400 text-xs sm:text-sm mb-2 block">Expense Name</label>
            <input
              type="text"
              placeholder="Enter expense name"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-700 bg-gray-900/50 text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-all duration-300 focus:shadow-lg focus:shadow-yellow-500/20"
            />
          </div>

          {/* Total Amount */}
          <div>
            <label className="text-gray-400 text-xs sm:text-sm mb-2 block">Total Amount</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value >= 0 ? e.target.value : '');
                  setIsPaidEqually(false);
                }}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-700 bg-gray-900/50 text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-all duration-300 focus:shadow-lg focus:shadow-yellow-500/20"
              />
            </div>
          </div>

          {/* Paid Equally Button */}
          <button
            onClick={handlePaidEqually}
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.98]"
          >
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            Paid Equally (Auto-fill)
          </button>

          {/* Paid By Section */}
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              <h3 className="font-semibold text-white text-base sm:text-lg">Paid By</h3>
            </div>
            <div className={`space-y-2 ${members.length > 3 ? 'max-h-[180px] sm:max-h-[200px] overflow-y-auto scrollbar-hide' : ''} bg-gray-900/30 rounded-lg sm:rounded-xl p-2 sm:p-3`}>
              {members.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 sm:gap-3 bg-gray-800/50 p-2 sm:p-3 rounded-lg border border-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={!!paidBy.find(p => p.name === member.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPaidBy([...paidBy, { ...member, amount: 0 }]);
                      } else {
                        setPaidBy(paidBy.filter(p => p.name !== member.name));
                        setIsPaidEqually(false);
                      }
                    }}
                    disabled={isPaidEqually}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-600 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-gray-800 disabled:opacity-50 flex-shrink-0"
                  />
                  <span className="text-white text-sm sm:text-base flex-1 min-w-0 truncate">{member.name}</span>
                  {paidBy.find(p => p.name === member.name) && (
                    <input
                      type="number"
                      placeholder="0.00"
                      value={paidBy.find(p => p.name === member.name)?.amount || ''}
                      onChange={(e) => handleAmountChange(e, member)}
                      disabled={isPaidEqually}
                      className="w-20 sm:w-24 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border-2 border-gray-600 bg-gray-900 text-white text-sm sm:text-base text-right focus:outline-none focus:border-yellow-500 transition-all duration-300 disabled:opacity-50 flex-shrink-0"
                    />
                  )}
                </div>
              ))}
            </div>
            {isPaidEqually && (
              <div className="mt-2 p-2 sm:p-3 bg-blue-500/10 border border-blue-500/50 rounded-lg text-blue-400 text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Paid equally mode active - amounts are locked</span>
              </div>
            )}
          </div>

          {/* Split Amongst Section */}
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                <h3 className="font-semibold text-white text-base sm:text-lg">Split Amongst</h3>
              </div>
              <button
                onClick={handleSplitEqually}
                disabled={isPaidEqually}
                className="text-xs sm:text-sm bg-gray-800 hover:bg-gray-700 text-yellow-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-300 disabled:opacity-50 active:scale-[0.98]"
              >
                Split Equally
              </button>
            </div>
            <div className={`space-y-2 ${members.length > 3 ? 'max-h-[180px] sm:max-h-[200px] overflow-y-auto scrollbar-hide' : ''} bg-gray-900/30 rounded-lg sm:rounded-xl p-2 sm:p-3`}>
              {members.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 sm:gap-3 bg-gray-800/50 p-2 sm:p-3 rounded-lg border border-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={!!splitAmongst.find(p => p.name === member.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSplitAmongst([...splitAmongst, member]);
                      } else {
                        setSplitAmongst(splitAmongst.filter(p => p.name !== member.name));
                        setIsPaidEqually(false);
                      }
                    }}
                    disabled={isPaidEqually}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-600 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-gray-800 disabled:opacity-50 flex-shrink-0"
                  />
                  <span className="text-white text-sm sm:text-base">{member.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/50 rounded-lg sm:rounded-xl text-red-500 text-center text-sm sm:text-base">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
            <button
              onClick={onClose}
              className="w-full sm:flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateExpense}
              disabled={loading}
              className="w-full sm:flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-yellow-500/50 flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.98]"
            >
              <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
              {loading ? 'Updating...' : 'Update Expense'}
            </button>
          </div>
        </div>
      </div>

      <style >{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default EditExpenseForm;