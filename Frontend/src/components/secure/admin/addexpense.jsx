import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Receipt, X, Users, IndianRupee, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import useStore from '../../../store/useStore';

const AddExpenseForm = ({ groupId, onClose, isDark }) => {
  const [currentStep, setCurrentStep] = useState(1);
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

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!expenseName.trim()) {
        setError('Please enter an expense name');
        return;
      }
      if (!amount || parseFloat(amount) <= 0) {
        setError('Please enter a valid amount');
        return;
      }
      setError('');
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const totalPaid = paidBy.reduce((sum, member) => sum + parseFloat(member.amount || 0), 0);
      const totalAmount = parseFloat(amount);
      
      if (paidBy.length === 0) {
        setError('Please select at least one person who paid');
        return;
      }
      
      if (Math.abs(totalPaid - totalAmount) > 0.01) {
        setError('Total amount paid by members must equal the specified amount.');
        return;
      }
      
      setError('');
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setError('');
    setCurrentStep(currentStep - 1);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Expense Details';
      case 2:
        return 'Who Paid?';
      case 3:
        return 'Split Between';
      default:
        return 'Add Expense';
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
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'hover:bg-[#1f2329] text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <h2 className={`text-xl font-bold truncate ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>{getStepTitle()}</h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Step {currentStep} of 3
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
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`h-1 flex-1 rounded-full transition-all ${
              step <= currentStep
                ? isDark
                  ? 'bg-green-600'
                  : 'bg-green-500'
                : isDark
                ? 'bg-[#1f2329]'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Step 1: Expense Details */}
        {currentStep === 1 && (
          <div className="space-y-6 max-w-md">
            <div>
              <label className={`text-sm mb-2 block font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>Expense Name</label>
              <input
                type="text"
                placeholder="Enter expense name"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                className={`expense-name-input w-full px-4 py-3 rounded-xl border-2 text-base focus:outline-none transition-all ${
                  isDark 
                    ? 'border-gray-700 bg-[#1f2329] text-white placeholder-gray-500 focus:border-green-600' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500'
                }`}
              />
            </div>

            <div>
              <label className={`text-sm mb-2 block font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>Total Amount</label>
              <div className="relative">
                <IndianRupee className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value >= 0 ? e.target.value : '')}
                  className={`expense-amount-input w-full pl-12 pr-4 py-3 rounded-xl border-2 text-base focus:outline-none transition-all ${
                    isDark 
                      ? 'border-gray-700 bg-[#1f2329] text-white placeholder-gray-500 focus:border-green-600' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-green-500'
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Paid By */}
        {currentStep === 2 && (
          <div className="paid-by-section space-y-4 max-w-md">
            <button
              onClick={handlePaidEqually}
              className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 text-sm font-medium ${
                isDark 
                  ? 'bg-[#1f2329] hover:bg-gray-700 text-gray-300 border border-gray-700' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              <Users className="w-4 h-4" />
              Paid Equally (Auto-fill)
            </button>

            <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-hide">
              {members.map((member, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    isDark 
                      ? 'bg-[#1f2329] border-gray-700' 
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
                    className="w-5 h-5 rounded text-green-600 focus:ring-green-600"
                  />
                  <span className={`text-base flex-1 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{member.name}</span>
                  {paidBy.find(p => p.name === member.name) && (
                    <input
                      type="number"
                      placeholder="0.00"
                      value={paidBy.find(p => p.name === member.name)?.amount || ''}
                      onChange={(e) => handleAmountChange(e, member, 'paidBy')}
                      disabled={isPaidEqually}
                      className={`w-24 px-3 py-2 rounded-lg border-2 text-base text-right focus:outline-none ${
                        isDark 
                          ? 'border-gray-600 bg-gray-900 text-white focus:border-green-600' 
                          : 'border-gray-300 bg-white text-gray-900 focus:border-green-500'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {isPaidEqually && (
              <div className={`p-3 border rounded-xl text-sm flex items-center gap-2 ${
                isDark 
                  ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' 
                  : 'bg-blue-50 border-blue-300 text-blue-600'
              }`}>
                <CheckCircle className="w-4 h-4" />
                <span>Paid equally mode active</span>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Split Amongst */}
        {currentStep === 3 && (
          <div className="split-amongst-section space-y-4 max-w-md">
            <button
              onClick={handleSplitEqually}
              disabled={isPaidEqually}
              className={`split-equally-button px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 text-sm font-medium disabled:opacity-50 ${
                isDark 
                  ? 'bg-[#1f2329] hover:bg-gray-700 text-gray-300 border border-gray-700' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              <Users className="w-4 h-4" />
              Split Equally
            </button>

            <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-hide">
              {members.map((member, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    isDark 
                      ? 'bg-[#1f2329] border-gray-700' 
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
                    className="w-5 h-5 rounded text-green-600 focus:ring-green-600"
                  />
                  <span className={`text-base ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className={`mt-4 p-4 border rounded-xl ${
            isDark 
              ? 'bg-red-500/10 border-red-500/50 text-red-500' 
              : 'bg-red-50 border-red-300 text-red-600'
          }`}>
            {error}
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className={`flex-shrink-0 p-4 border-t flex items-center justify-between ${
        isDark ? 'bg-[#1f2329] border-gray-700' : 'bg-white border-gray-200'
      }`}>
        {currentStep > 1 ? (
          <button
            onClick={handleBack}
            className={`p-3 rounded-full transition-colors ${
              isDark 
                ? 'bg-[#1f2329] hover:bg-gray-700 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-12" />
        )}

        {currentStep < 3 ? (
          <button
            onClick={handleNextStep}
            className={`expense-next-button p-3 rounded-full transition-colors shadow-lg ${
              isDark 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={handleAddExpense}
            disabled={loading}
            className={`add-expense-submit-button px-6 py-3 rounded-full transition-colors shadow-lg disabled:opacity-50 font-semibold ${
              isDark 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {loading ? 'Adding...' : 'Add Expense'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AddExpenseForm;