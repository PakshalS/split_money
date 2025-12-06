import React, { useState } from "react";
import { Wallet, ChevronDown, ChevronUp } from "lucide-react";

const BalancesComponent = ({ balances }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl border border-gray-800 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="p-1.5 sm:p-2 bg-green-700/10 rounded-lg flex-shrink-0">
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xl sm:text-2xl font-bold text-white truncate">Balances</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Individual balance sheet</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 sm:gap-2 text-green-700 hover:text-green-400 transition-colors duration-300 flex-shrink-0"
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
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <Wallet className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 opacity-30" />
              <p className="text-base sm:text-lg">No balances calculated</p>
            </div>
          ) : (
            <div className={`space-y-2 ${balances.length > 3 ? 'max-h-[250px] sm:max-h-[300px] overflow-y-auto scrollbar-hide' : ''}`}>
              {balances.map((balance) => (
                <div
                  key={balance._id}
                  className="bg-gray-900/50 border-2 border-gray-800 hover:border-gray-700 p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300"
                >
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-sm sm:text-base text-white font-medium">{balance.name}</span>
                    <span className={`font-bold text-base sm:text-lg flex-shrink-0  ${balance.balance >= 0 ? 'text-green-700' : 'text-red-500'}`}>
                      ₹{balance.balance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
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