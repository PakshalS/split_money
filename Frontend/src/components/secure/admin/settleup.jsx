import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { HandCoins, X, ArrowRight, IndianRupee } from 'lucide-react';
import useStore from '../../../store/useStore';

const SettleUpForm = ({ groupId, onClose, isDark, initialData }) => {
  const [payer, setPayer] = useState(initialData?.payer || '');
  const [receiver, setReceiver] = useState(initialData?.receiver || '');
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get store data and actions
  const { groupDetails: allGroupDetails, addSettlement } = useStore();

  useEffect(() => {
    // Get members from store
    const groupData = allGroupDetails[groupId];
    if (groupData?.group?.members) {
      setMembers(groupData.group.members);
    }
  }, [groupId, allGroupDetails]);

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
      await addSettlement(groupId, {
        payer: { name: payer },
        receiver: { name: receiver },
        amount: parseFloat(amount),
        date: new Date().toISOString(),
      });

      alert('Settlement recorded successfully!');
      onClose();
    } catch (error) {
      console.error('Error recording settlement:', error);
      setError(error.message || 'Failed to record settlement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`absolute inset-0 z-50 flex flex-col ${isDark ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      {/* Header */}
      <div className={`flex-shrink-0 border-b p-4 flex items-center justify-between ${
        isDark 
          ? 'bg-[#1f2329] border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12" />
          <div className="flex-1 min-w-0">
            <h2 className={`text-xl font-bold truncate ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Settle Up</h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Record Payment
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className={`p-2 rounded-lg transition-colors ${
            isDark 
              ? 'hover:bg-[#1f2329] text-gray-400 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Step Progress Indicator */}
      <div className={`flex-shrink-0 flex gap-2 px-4 py-3 border-b ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className={`h-1 flex-1 rounded-full ${
          isDark ? 'bg-green-600' : 'bg-green-500'
        }`} />
      </div>

      {/* Content Area */}
      <div className="settle-up-form flex-1 overflow-y-auto p-4">
        <div className="space-y-6 max-w-md">
          {/* Payer Selection */}
          <div>
            <label className={`text-sm mb-2 block font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>Payer (Who is paying)</label>
            <div className="relative">
              <select
                value={payer}
                onChange={(e) => {
                  setPayer(e.target.value);
                  setError('');
                }}
                className={`settle-up-payer w-full px-4 py-3 rounded-xl border-2 text-base appearance-none focus:outline-none transition-all cursor-pointer ${
                  isDark 
                    ? 'border-gray-700 bg-[#1f2329] text-white focus:border-green-600' 
                    : 'border-gray-300 bg-white text-gray-900 focus:border-green-500'
                }`}
              >
                <option value="" className={isDark ? 'bg-[#1f2329]' : 'bg-white'}>Select Payer</option>
                {members.map((member, index) => (
                  <option key={index} value={member.name} className={isDark ? 'bg-[#1f2329]' : 'bg-white'}>
                    {member.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className={`w-5 h-5 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Arrow Indicator */}
          <div className="flex justify-center py-2">
            <div className={`p-2 rounded-lg ${
              isDark ? 'bg-green-600/10' : 'bg-green-100'
            }`}>
              <ArrowRight className={`w-6 h-6 ${
                isDark ? 'text-green-600' : 'text-green-600'
              }`} />
            </div>
          </div>

          {/* Receiver Selection */}
          <div>
            <label className={`text-sm mb-2 block font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>Receiver (Who is receiving)</label>
            <div className="relative">
              <select
                value={receiver}
                onChange={(e) => {
                  setReceiver(e.target.value);
                  setError('');
                }}
                className={`settle-up-receiver w-full px-4 py-3 rounded-xl border-2 text-base appearance-none focus:outline-none transition-all cursor-pointer ${
                  isDark 
                    ? 'border-gray-700 bg-[#1f2329] text-white focus:border-green-600' 
                    : 'border-gray-300 bg-white text-gray-900 focus:border-green-500'
                }`}
              >
                <option value="" className={isDark ? 'bg-[#1f2329]' : 'bg-white'}>Select Receiver</option>
                {members.map((member, index) => (
                  <option key={index} value={member.name} className={isDark ? 'bg-[#1f2329]' : 'bg-white'}>
                    {member.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className={`w-5 h-5 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className={`text-sm mb-2 block font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>Settlement Amount</label>
            <div className="relative">
              <IndianRupee className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value >= 0 ? e.target.value : '');
                  setError('');
                }}
                className={`settle-up-amount w-full pl-12 pr-4 py-3 rounded-xl border-2 text-base focus:outline-none transition-all ${
                  isDark 
                    ? 'border-gray-700 bg-[#1f2329] text-white placeholder-gray-500 focus:border-green-600' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500'
                }`}
              />
            </div>
          </div>

          {/* Summary Display */}
          {payer && receiver && amount && parseFloat(amount) > 0 && (
            <div className={`p-4 border rounded-xl ${
              isDark 
                ? 'bg-green-600/10 border-green-600/50' 
                : 'bg-green-50 border-green-300'
            }`}>
              <p className={`text-center text-base ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <span className={`font-semibold ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`}>{payer}</span>
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}> pays </span>
                <span className="font-bold">₹{amount}</span>
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}> to </span>
                <span className={`font-semibold ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`}>{receiver}</span>
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className={`p-4 border rounded-xl ${
              isDark 
                ? 'bg-red-500/10 border-red-500/50 text-red-500' 
                : 'bg-red-50 border-red-300 text-red-600'
            }`}>
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className={`flex-shrink-0 p-4 border-t flex items-center justify-between ${
        isDark ? 'bg-[#1f2329] border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="w-12" />
        <button
          onClick={handleSettleUp}
          disabled={loading}
          className={`add-settle-up-button px-6 py-3 rounded-full transition-colors shadow-lg disabled:opacity-50 font-semibold ${
            isDark 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {loading ? 'Processing...' : 'Settle Up'}
        </button>
      </div>
    </div>
  );
};

export default SettleUpForm;