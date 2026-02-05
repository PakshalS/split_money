import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Receipt, X, Users, IndianRupee, CheckCircle } from 'lucide-react';
import useStore from '../../../store/useStore';

const AddExpenseForm = ({ groupId, onClose, isDark }) => {
  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState('');
  const [members, setMembers] = useState([]);
  const [paidBy, setPaidBy] = useState([]);
  const [splitAmongst, setSplitAmongst] = useState([]);
  const [isPaidEqually, setIsPaidEqually] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get store actions
  const { groupDetails: allGroupDetails, addExpense } = useStore();

  useEffect(() => {
    // Get members from store
    const groupData = allGroupDetails[groupId];
    if (groupData?.group?.members) {
      setMembers(groupData.group.members);
    }
  }, [groupId, allGroupDetails]);

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

  const handleAddExpense = async () => {
    const totalPaid = paidBy.reduce((sum, member) => sum + parseFloat(member.amount || 0), 0);
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
      await addExpense(groupId, {
        name: expenseName,
        amount,
        paidBy,
        splitAmongst,
      });

      alert('Expense added successfully!');
      onClose();
    } catch (error) {
      console.error('Error adding expense:', error);
      setError(error.message || 'Failed to add expense');
    } finally {
      setLoading(false);
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
  };

  const handleSplitEqually = () => {
    setSplitAmongst(members);
  };

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-0  flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
      <div className={`rounded-xl sm:rounded-2xl shadow-2xl border w-full max-w-2xl max-h-[80vh] sm:max-h-[80vh] overflow-y-auto scrollbar-hide ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800' 
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 border-b p-4 sm:p-5 md:p-6 flex items-center justify-between rounded-t-xl sm:rounded-t-2xl z-50 shadow-xl ${
          isDark 
            ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800' 
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
              isDark ? 'bg-green-700/10' : 'bg-green-100'
            }`}>
              <Receipt className={`w-5 h-5 sm:w-6 sm:h-6 ${
                isDark ? 'text-green-700' : 'text-green-600'
              }`} />
            </div>
            <h2 className={`text-xl sm:text-2xl font-bold truncate ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Add Expense</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors duration-300 flex-shrink-0 ${
              isDark 
                ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Expense Name */}
          <div>
            <label className={`text-xs sm:text-sm mb-2 block ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Expense Name</label>
            <input
              type="text"
              placeholder="Enter expense name"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 text-sm sm:text-base focus:outline-none transition-all duration-300 focus:shadow-lg ${
                isDark 
                  ? 'border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:border-green-700 focus:shadow-green-700/20' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:shadow-green-500/20'
              }`}
            />
          </div>

          {/* Total Amount */}
          <div>
            <label className={`text-xs sm:text-sm mb-2 block ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Total Amount</label>
            <div className="relative">
              <IndianRupee className={`absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value >= 0 ? e.target.value : '');
                  setIsPaidEqually(false);
                }}
                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 text-sm sm:text-base focus:outline-none transition-all duration-300 focus:shadow-lg ${
                  isDark 
                    ? 'border-gray-700 bg-gray-900/50 text-white placeholder-gray-500 focus:border-green-700 focus:shadow-green-700/20' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500 focus:shadow-green-500/20'
                }`}
              />
            </div>
          </div>

          {/* Paid Equally Button */}
          <button
            onClick={handlePaidEqually}
            disabled={!amount || parseFloat(amount) <= 0}
            className={`w-full font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.98] ${
              isDark 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-blue-500/50' 
                : 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white hover:shadow-blue-400/50'
            }`}
          >
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            Paid Equally (Auto-fill)
          </button>

          {/* Paid By Section */}
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <IndianRupee className={`w-4 h-4 sm:w-5 sm:h-5 ${
                isDark ? 'text-green-700' : 'text-green-600'
              }`} />
              <h3 className={`font-semibold text-base sm:text-lg ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Paid By</h3>
            </div>
            <div className={`space-y-2 ${members.length > 3 ? 'max-h-[180px] sm:max-h-[200px] overflow-y-auto scrollbar-hide' : ''} rounded-lg sm:rounded-xl p-2 sm:p-3 ${
              isDark ? 'bg-gray-900/30' : 'bg-gray-100/50'
            }`}>
              {members.map((member, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-800/50 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`}
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
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded text-green-700 focus:ring-green-700 disabled:opacity-50 flex-shrink-0 ${
                      isDark 
                        ? 'border-gray-600 focus:ring-offset-gray-800' 
                        : 'border-gray-300 focus:ring-offset-white'
                    }`}
                  />
                  <span className={`text-sm sm:text-base flex-1 min-w-0 truncate ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{member.name}</span>
                  {paidBy.find(p => p.name === member.name) && (
                    <input
                      type="number"
                      placeholder="0.00"
                      value={paidBy.find(p => p.name === member.name)?.amount || ''}
                      onChange={(e) => handleAmountChange(e, member, 'paidBy')}
                      disabled={isPaidEqually}
                      className={`w-20 sm:w-24 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border-2 text-sm sm:text-base text-right focus:outline-none transition-all duration-300 disabled:opacity-50 flex-shrink-0 ${
                        isDark 
                          ? 'border-gray-600 bg-gray-900 text-white focus:border-green-700' 
                          : 'border-gray-300 bg-white text-gray-900 focus:border-green-500'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            {isPaidEqually && (
              <div className={`mt-2 p-2 sm:p-3 border rounded-lg text-xs sm:text-sm flex items-center gap-2 ${
                isDark 
                  ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' 
                  : 'bg-blue-50 border-blue-300 text-blue-600'
              }`}>
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Paid equally mode active - amounts are locked</span>
              </div>
            )}
          </div>

          {/* Split Amongst Section */}
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center gap-2">
                <Users className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  isDark ? 'text-green-700' : 'text-green-600'
                }`} />
                <h3 className={`font-semibold text-base sm:text-lg ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Split Amongst</h3>
              </div>
              <button
                onClick={handleSplitEqually}
                disabled={isPaidEqually}
                className={`text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-300 disabled:opacity-50 active:scale-[0.98] ${
                  isDark 
                    ? 'bg-gray-800 hover:bg-gray-700 text-green-700' 
                    : 'bg-gray-200 hover:bg-gray-300 text-green-600'
                }`}
              >
                Split Equally
              </button>
            </div>
            <div className={`space-y-2 ${members.length > 3 ? 'max-h-[180px] sm:max-h-[200px] overflow-y-auto scrollbar-hide' : ''} rounded-lg sm:rounded-xl p-2 sm:p-3 ${
              isDark ? 'bg-gray-900/30' : 'bg-gray-100/50'
            }`}>
              {members.map((member, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-800/50 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`}
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
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded text-green-700 focus:ring-green-700 disabled:opacity-50 flex-shrink-0 ${
                      isDark 
                        ? 'border-gray-600 focus:ring-offset-gray-800' 
                        : 'border-gray-300 focus:ring-offset-white'
                    }`}
                  />
                  <span className={`text-sm sm:text-base ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{member.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`p-3 sm:p-4 border rounded-lg sm:rounded-xl text-center text-sm sm:text-base ${
              isDark 
                ? 'bg-red-500/10 border-red-500/50 text-red-500' 
                : 'bg-red-50 border-red-300 text-red-600'
            }`}>
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
            <button
              onClick={onClose}
              className={`w-full sm:flex-1 font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base active:scale-[0.98] ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleAddExpense}
              disabled={loading}
              className={`w-full sm:flex-1 bg-gradient-to-r font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base active:scale-[0.98] ${
                isDark 
                  ? 'from-green-700 to-green-600 text-white hover:text-black' 
                  : 'from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600'
              }`}
            >
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
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

export default AddExpenseForm;