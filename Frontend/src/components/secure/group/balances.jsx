import React, { useState } from "react";
import { Wallet, ChevronDown, ChevronUp, Info, X } from "lucide-react";

const BalancesComponent = ({ balances, isDark, membersWithSpend }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Helper function to get total spend for a member
  const getTotalSpend = (memberName) => {
    if (!membersWithSpend || !Array.isArray(membersWithSpend)) {
      return 0;
    }
    
    const member = membersWithSpend.find(m => m.name === memberName);
    return member?.totalSpend || 0;
  };

  return (
    <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border transition-all duration-300 ${
      isDark 
        ? 'bg-gray-900 border-gray-800' 
        :'bg-gray-50 border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
            isDark ? 'bg-green-700/10' : 'bg-green-100'
          }`}>
            <Wallet className={`w-5 h-5 sm:w-6 sm:h-6 ${
              isDark ? 'text-green-700' : 'text-green-600'
            }`} />
          </div>
          <div className="min-w-0">
            <h3 className={`text-xl sm:text-2xl font-bold truncate ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Balances</h3>
            <p className={`text-xs sm:text-sm mt-1 ${
              isDark ? 'text-gray-500' : 'text-gray-600'
            }`}>Individual balance sheet</p>
          </div>
          <button
            onClick={() => setShowInfoModal(true)}
            className={`p-1.5 rounded-lg transition-all duration-300 flex-shrink-0 ${
              isDark 
                ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
            title="Learn more"
          >
            <Info className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-1 sm:gap-2 transition-colors duration-300 flex-shrink-0 ${
            isDark 
              ? 'text-green-700 hover:text-green-400' 
              : 'text-green-600 hover:text-green-700'
          }`}
        >
          {isExpanded ? (
            <>
              <span className="text-xs sm:text-sm font-medium">Hide</span>
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </>
          ) : (
            <>
              <span className="text-xs sm:text-sm font-medium">Show</span>
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
            </>
          )}
        </button>
      </div>

      {/* Balances List */}
      {isExpanded && (
        <>
          {balances.length === 0 ? (
            <div className={`text-center py-6 sm:py-8 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              <Wallet className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 opacity-30" />
              <p className="text-base sm:text-lg">No balances calculated</p>
            </div>
          ) : (
            <div className={`space-y-2 ${balances.length > 3 ? 'max-h-[250px] sm:max-h-[300px] overflow-y-auto scrollbar-hide' : ''}`}>
              {balances.map((balance) => (
                <div
                  key={balance._id}
                  className={`border-2 p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 ${
                    isDark 
                      ? 'bg-gray-900/50 border-gray-800 hover:border-gray-700' 
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center gap-2">
                    <span className={`text-sm sm:text-base font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{balance.name}</span>
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className={`font-bold text-base sm:text-lg ${
                        balance.balance >= 0 ? (isDark ? 'text-green-700' : 'text-green-600') : 'text-red-500'
                      }`}>
                        ₹{Number(balance.balance).toFixed(2)}
                      </span>
                      <span className={`text-xs sm:text-sm ${
                        isDark ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        Spent: ₹{Number(getTotalSpend(balance.name)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl sm:rounded-2xl shadow-2xl border max-w-md w-full ${
            isDark 
              ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800' 
              : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
          }`}>
            {/* Modal Header */}
            <div className={`border-b p-4 sm:p-5 flex items-center justify-between ${
              isDark ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`p-1.5 sm:p-2 rounded-lg ${
                  isDark ? 'bg-green-700/10' : 'bg-green-100'
                }`}>
                  <Info className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    isDark ? 'text-green-700' : 'text-green-600'
                  }`} />
                </div>
                <h3 className={`text-lg sm:text-xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>How it Works</h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className={`p-1.5 rounded-lg transition-colors duration-300 ${
                  isDark 
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-5 space-y-4">
              {/* Balance Explanation */}
              <div>
                <h4 className={`text-base sm:text-lg font-semibold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Balance</h4>
                <p className={`text-sm leading-relaxed ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Shows how much each person owes or is owed in the group.
                </p>
                <ul className={`mt-2 space-y-1 text-xs sm:text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <li className="flex items-start gap-2">
                    <span className={`${isDark ? 'text-green-700' : 'text-green-600'} font-bold`}>•</span>
                    <span><span className={`font-semibold ${isDark ? 'text-green-700' : 'text-green-600'}`}>Positive</span> = Others owe you money</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span><span className="font-semibold text-red-500">Negative</span> = You owe others money</span>
                  </li>
                </ul>
              </div>

              {/* Total Spend Explanation */}
              <div className={`border-t pt-4 ${
                isDark ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <h4 className={`text-base sm:text-lg font-semibold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Total Spend</h4>
                <p className={`text-sm leading-relaxed mb-3 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Shows the actual amount each person has paid out. Calculated as:
                </p>
                <div className={`rounded-lg p-3 space-y-2 text-xs sm:text-sm ${
                  isDark ? 'bg-gray-900/50' : 'bg-gray-100'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono ${isDark ? 'text-green-700' : 'text-green-600'}`}>+</span>
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Amount paid in expenses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono ${isDark ? 'text-green-700' : 'text-green-600'}`}>+</span>
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Money paid to others (settlements)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-red-500">−</span>
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Money received from others</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`border-t p-4 sm:p-5 ${
              isDark ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <button
                onClick={() => setShowInfoModal(false)}
                className={`w-full py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                  isDark 
                    ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

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

export default BalancesComponent;