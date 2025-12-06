// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { HandCoins, X, DollarSign, ArrowRight, User, IndianRupee } from 'lucide-react';

// const SettleUpForm = ({ groupId, onClose }) => {
//   const [payer, setPayer] = useState('');
//   const [receiver, setReceiver] = useState('');
//   const [amount, setAmount] = useState('');
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchMembers = async () => {
//       try {
//         const token = Cookies.get('authToken');
//         if (!token) {
//           console.error('No auth token found');
//           return;
//         }

//         const response = await axios.get(`https://split-money-api.vercel.app/groups/${groupId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setMembers(response.data.group.members);
//       } catch (error) {
//         console.error('Error fetching members:', error);
//         setError('Failed to fetch members');
//       }
//     };

//     fetchMembers();
//   }, [groupId]);

//   const handleSettleUp = async () => {
//     if (parseFloat(amount) <= 0) {
//       setError('The amount must be greater than zero.');
//       return;
//     }

//     if (!payer || !receiver) {
//       setError('Please select both a payer and a receiver.');
//       return;
//     }

//     if (payer === receiver) {
//       setError('Payer and receiver must be different.');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const token = Cookies.get('authToken');
//       if (!token) {
//         console.error('No auth token found');
//         return;
//       }

//       await axios.post(
//         `https://split-money-api.vercel.app/groups/${groupId}/settleup`,
//         {
//           groupId,
//           payer: { name: payer },
//           receiver: { name: receiver },
//           amount,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert('Settlement recorded successfully!');
//       onClose();
//     } catch (error) {
//       console.error('Error recording settlement:', error);
//       setError(error.response?.data?.error || 'Failed to record settlement');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl shadow-2xl border border-gray-800 w-full max-w-md">
//         {/* Header */}
//         <div className="bg-gradient-to-br from-gray-900 to-gray-950 border-b border-gray-800 p-6 flex items-center justify-between rounded-t-2xl">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-green-700/10 rounded-lg">
//               <HandCoins className="w-6 h-6 text-green-700" />
//             </div>
//             <h2 className="text-2xl font-bold text-white">Settle Up</h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-300"
//           >
//             <X className="w-6 h-6 text-gray-400 hover:text-white" />
//           </button>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* Payer Selection */}
//           <div>
//             <label className="text-gray-400 text-sm mb-2 flex items-center gap-2">
//               <User className="w-4 h-4" />
//               Payer (Who is paying)
//             </label>
//             <div className="relative">
//               <select
//                 value={payer}
//                 onChange={(e) => {
//                   setPayer(e.target.value);
//                   setError('');
//                 }}
//                 className="w-full px-4 py-3 rounded-xl border-2 border-gray-700 bg-gray-900/50 text-white appearance-none focus:outline-none focus:border-green-700 transition-all duration-300 focus:shadow-lg focus:shadow-green-700/20 cursor-pointer"
//                 style={{
//                   maxHeight: members.length > 3 ? '150px' : 'auto',
//                 }}
//               >
//                 <option value="" className="bg-gray-800">Select Payer</option>
//                 {members.map((member, index) => (
//                   <option key={index} value={member.name} className="bg-gray-800 py-2">
//                     {member.name}
//                   </option>
//                 ))}
//               </select>
//               <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
//                 <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {/* Arrow Indicator */}
//           <div className="flex justify-center">
//             <div className="p-2 bg-green-700/10 rounded-lg">
//               <ArrowRight className="w-6 h-6 text-green-700" />
//             </div>
//           </div>

//           {/* Receiver Selection */}
//           <div>
//             <label className="text-gray-400 text-sm mb-2 flex items-center gap-2">
//               <User className="w-4 h-4" />
//               Receiver (Who is receiving)
//             </label>
//             <div className="relative">
//               <select
//                 value={receiver}
//                 onChange={(e) => {
//                   setReceiver(e.target.value);
//                   setError('');
//                 }}
//                 className="w-full px-4 py-3 rounded-xl border-2 border-gray-700 bg-gray-900/50 text-white appearance-none focus:outline-none focus:border-green-700 transition-all duration-300 focus:shadow-lg focus:shadow-green-700/20 cursor-pointer"
//                 style={{
//                   maxHeight: members.length > 3 ? '150px' : 'auto',
//                 }}
//               >
//                 <option value="" className="bg-gray-800">Select Receiver</option>
//                 {members.map((member, index) => (
//                   <option key={index} value={member.name} className="bg-gray-800 py-2">
//                     {member.name}
//                   </option>
//                 ))}
//               </select>
//               <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
//                 <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {/* Amount Input */}
//           <div>
//             <label className="text-gray-400 text-sm mb-2 block">Settlement Amount</label>
//             <div className="relative">
//               <IndianRupee className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
//               <input
//                 type="number"
//                 placeholder="0.00"
//                 value={amount}
//                 onChange={(e) => {
//                   setAmount(e.target.value >= 0 ? e.target.value : '');
//                   setError('');
//                 }}
//                 className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:border-green-700 transition-all duration-300 focus:shadow-lg focus:shadow-green-700/20"
//               />
//             </div>
//           </div>

//           {/* Summary Display */}
//           {payer && receiver && amount && parseFloat(amount) > 0 && (
//             <div className="p-4 bg-green-700/10 border border-green-700/50 rounded-xl">
//               <p className="text-white text-center">
//                 <span className="font-semibold text-green-700">{payer}</span>
//                 <span className="text-gray-400"> pays </span>
//                 <span className="font-bold text-white">${amount}</span>
//                 <span className="text-gray-400"> to </span>
//                 <span className="font-semibold text-green-700">{receiver}</span>
//               </p>
//             </div>
//           )}

//           {/* Error Message */}
//           {error && (
//             <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-center">
//               {error}
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex gap-3 pt-4">
//             <button
//               onClick={onClose}
//               disabled={loading}
//               className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-all duration-300"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSettleUp}
//               disabled={loading}
//               className="flex-1 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-700/50 flex items-center justify-center gap-2"
//             >
//               <HandCoins className="w-5 h-5" />
//               {loading ? 'Processing...' : 'Settle Up'}
//             </button>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         select {
//           scrollbar-width: thin;
//           scrollbar-color: #4ade80 #1f2937;
//         }
        
//         select::-webkit-scrollbar {
//           width: 8px;
//         }
        
//         select::-webkit-scrollbar-track {
//           background: #1f2937;
//           border-radius: 10px;
//         }
        
//         select::-webkit-scrollbar-thumb {
//           background: #4ade80;
//           border-radius: 10px;
//         }
        
//         select::-webkit-scrollbar-thumb:hover {
//           background: #22c55e;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SettleUpForm;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { HandCoins, X, DollarSign, ArrowRight, User, IndianRupee } from 'lucide-react';

const SettleUpForm = ({ groupId, onClose }) => {
  const [payer, setPayer] = useState('');
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = Cookies.get('authToken');
        if (!token) {
          console.error('No auth token found');
          return;
        }

        const response = await axios.get(`https://split-money-api.vercel.app/groups/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMembers(response.data.group.members);
      } catch (error) {
        console.error('Error fetching members:', error);
        setError('Failed to fetch members');
      }
    };

    fetchMembers();
  }, [groupId]);

  const handleSettleUp = async () => {
    if (parseFloat(amount) <= 0) {
      setError('The amount must be greater than zero.');
      return;
    }

    if (!payer || !receiver) {
      setError('Please select both a payer and a receiver.');
      return;
    }

    if (payer === receiver) {
      setError('Payer and receiver must be different.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = Cookies.get('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      await axios.post(
        `https://split-money-api.vercel.app/groups/${groupId}/settleup`,
        {
          groupId,
          payer: { name: payer },
          receiver: { name: receiver },
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Settlement recorded successfully!');
      onClose();
    } catch (error) {
      console.error('Error recording settlement:', error);
      setError(error.response?.data?.error || 'Failed to record settlement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-800 w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-gray-900 to-gray-950 border-b border-gray-800 p-4 sm:p-5 md:p-6 flex items-center justify-between rounded-t-xl sm:rounded-t-2xl z-10">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 bg-green-700/10 rounded-lg flex-shrink-0">
              <HandCoins className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white truncate">Settle Up</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg transition-colors duration-300 flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Payer Selection */}
          <div>
            <label className="text-gray-400 text-xs sm:text-sm mb-2 flex items-center gap-2">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Payer (Who is paying)
            </label>
            <div className="relative">
              <select
                value={payer}
                onChange={(e) => {
                  setPayer(e.target.value);
                  setError('');
                }}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-700 bg-gray-900/50 text-white text-sm sm:text-base appearance-none focus:outline-none focus:border-green-700 transition-all duration-300 focus:shadow-lg focus:shadow-green-700/20 cursor-pointer"
                style={{
                  maxHeight: members.length > 3 ? '150px' : 'auto',
                }}
              >
                <option value="" className="bg-gray-800">Select Payer</option>
                {members.map((member, index) => (
                  <option key={index} value={member.name} className="bg-gray-800 py-2">
                    {member.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Arrow Indicator */}
          <div className="flex justify-center py-1 sm:py-2">
            <div className="p-1.5 sm:p-2 bg-green-700/10 rounded-lg">
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
            </div>
          </div>

          {/* Receiver Selection */}
          <div>
            <label className="text-gray-400 text-xs sm:text-sm mb-2 flex items-center gap-2">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Receiver (Who is receiving)
            </label>
            <div className="relative">
              <select
                value={receiver}
                onChange={(e) => {
                  setReceiver(e.target.value);
                  setError('');
                }}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-700 bg-gray-900/50 text-white text-sm sm:text-base appearance-none focus:outline-none focus:border-green-700 transition-all duration-300 focus:shadow-lg focus:shadow-green-700/20 cursor-pointer"
                style={{
                  maxHeight: members.length > 3 ? '150px' : 'auto',
                }}
              >
                <option value="" className="bg-gray-800">Select Receiver</option>
                {members.map((member, index) => (
                  <option key={index} value={member.name} className="bg-gray-800 py-2">
                    {member.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="text-gray-400 text-xs sm:text-sm mb-2 block">Settlement Amount</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value >= 0 ? e.target.value : '');
                  setError('');
                }}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-700 bg-gray-900/50 text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-green-700 transition-all duration-300 focus:shadow-lg focus:shadow-green-700/20"
              />
            </div>
          </div>

          {/* Summary Display */}
          {payer && receiver && amount && parseFloat(amount) > 0 && (
            <div className="p-3 sm:p-4 bg-green-700/10 border border-green-700/50 rounded-lg sm:rounded-xl">
              <p className="text-white text-center text-sm sm:text-base">
                <span className="font-semibold text-green-700">{payer}</span>
                <span className="text-gray-400"> pays </span>
                <span className="font-bold text-white">₹{amount}</span>
                <span className="text-gray-400"> to </span>
                <span className="font-semibold text-green-700">{receiver}</span>
              </p>
            </div>
          )}

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
              disabled={loading}
              className="w-full sm:flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              onClick={handleSettleUp}
              disabled={loading}
              className="w-full sm:flex-1 bg-gradient-to-r from-green-700 to-green-600  text-white font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:text-black flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.98]"
            >
              <HandCoins className="w-4 h-4 sm:w-5 sm:h-5" />
              {loading ? 'Processing...' : 'Settle Up'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        select {
          scrollbar-width: thin;
          scrollbar-color: #4ade80 #1f2937;
        }
        
        select::-webkit-scrollbar {
          width: 8px;
        }
        
        select::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 10px;
        }
        
        select::-webkit-scrollbar-thumb {
          background: #4ade80;
          border-radius: 10px;
        }
        
        select::-webkit-scrollbar-thumb:hover {
          background: #22c55e;
        }

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

export default SettleUpForm;