import React from "react";
import { TrendingUp } from "lucide-react";

const SummaryComponent = ({ summary, isDark }) => {
  return (
    <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6  border transition-all duration-300 ${
      isDark 
        ? 'bg-gray-900 border-gray-800' 
        :'bg-gray-50 border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
        <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
          isDark ? 'bg-green-700/10' : 'bg-green-100'
        }`}>
          <TrendingUp className={`w-5 h-5 sm:w-6 sm:h-6 ${
            isDark ? 'text-green-700' : 'text-green-600'
          }`} />
        </div>
        <div className="min-w-0">
          <h3 className={`text-xl sm:text-2xl font-bold truncate ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Summary</h3>
          <p className={`text-xs sm:text-sm mt-1 ${
            isDark ? 'text-gray-500' : 'text-gray-600'
          }`}>Quick overview of debts</p>
        </div>
      </div>

      {/* Summary List */}
      {summary.length === 0 ? (
        <div className={`text-center py-6 sm:py-8 ${
          isDark ? 'text-gray-500' : 'text-gray-400'
        }`}>
          <TrendingUp className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 opacity-30" />
          <p className="text-base sm:text-lg">No summary available</p>
          <p className="text-xs sm:text-sm mt-2">All balances are settled</p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-2.5">
          {summary.map((item, index) => (
            <div
              key={`${item.from}-${item.to}-${index}`}
              className={`border-2 p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-900/50 border-gray-800 hover:border-gray-700' 
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className={`text-sm sm:text-base leading-relaxed ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="font-semibold">{item.from}</span>
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}> owes </span>
                <span className="font-semibold">{item.to}</span>
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}> </span>
                <span className="font-bold">₹{item.amount}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SummaryComponent;