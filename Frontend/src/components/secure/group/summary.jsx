import React from "react";
import { TrendingUp } from "lucide-react";

const SummaryComponent = ({ summary }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl border border-gray-800 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
        <div className="p-1.5 sm:p-2 bg-green-700/10 rounded-lg flex-shrink-0">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xl sm:text-2xl font-bold text-white truncate">Summary</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Quick overview of debts</p>
        </div>
      </div>

      {/* Summary List */}
      {summary.length === 0 ? (
        <div className="text-center py-6 sm:py-8 text-gray-500">
          <TrendingUp className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 opacity-30" />
          <p className="text-base sm:text-lg">No summary available</p>
          <p className="text-xs sm:text-sm mt-2">All balances are settled</p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-2.5">
          {summary.map((item, index) => (
            <div
              key={`${item.from}-${item.to}-${index}`}
              className="bg-gray-900/50 border-2 border-gray-800 p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 hover:border-gray-700"
            >
              <p className="text-sm sm:text-base text-white leading-relaxed">
                <span className="font-semibold text-white">{item.from}</span>
                <span className="text-gray-400"> owes </span>
                <span className="font-semibold text-white">{item.to}</span>
                <span className="text-gray-400"> </span>
                <span className="font-bold text-white">₹{item.amount}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SummaryComponent;