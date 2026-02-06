import React from "react";
import { TrendingUp, HandCoins } from "lucide-react";

const SummaryComponent = ({ summary = [], isDark, isAdmin, onSettleUp, compact = false }) => {
  const containerPadding = compact ? "p-3 sm:p-4" : "p-4 sm:p-5 md:p-6";
  const headerIconSize = compact ? "w-4 h-4 sm:w-5 sm:h-5" : "w-5 h-5 sm:w-6 sm:h-6";
  const headerTitleSize = compact ? "text-base sm:text-lg" : "text-xl sm:text-2xl";
  const headerDescSize = compact ? "text-[11px] sm:text-xs" : "text-xs sm:text-sm";
  const itemPadding = compact ? "p-2.5 sm:p-3" : "p-3 sm:p-4";
  return (
    <div className={`rounded-xl sm:rounded-2xl ${containerPadding} border transition-all duration-300 ${
      isDark 
        ? 'bg-dark-bg border-gray-800' 
        :'bg-gray-50 border-gray-200'
    }`}>
      {/* Header */}
      <div className={`flex items-center gap-2 sm:gap-3 ${compact ? "mb-3" : "mb-4 sm:mb-5 md:mb-6"}`}>
        <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
          isDark ? 'bg-green-700/10' : 'bg-green-100'
        }`}>
          <TrendingUp className={`${headerIconSize} ${
            isDark ? 'text-green-700' : 'text-green-600'
          }`} />
        </div>
        <div className="min-w-0">
          <h3 className={`${headerTitleSize} font-bold truncate ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Summary</h3>
          <p className={`${headerDescSize} mt-1 ${
            isDark ? 'text-gray-500' : 'text-gray-600'
          }`}>Quick overview of debts</p>
        </div>
      </div>

      {/* Summary List */}
      {summary.length === 0 ? (
        <div className={`text-center ${compact ? "py-4" : "py-6 sm:py-8"} ${
          isDark ? 'text-gray-500' : 'text-gray-400'
        }`}>
          <TrendingUp className={`${compact ? "w-10 h-10" : "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"} mx-auto ${compact ? "mb-2" : "mb-3 sm:mb-4"} opacity-30`} />
          <p className={compact ? "text-sm" : "text-base sm:text-lg"}>No summary available</p>
          <p className={`${compact ? "text-[11px]" : "text-xs sm:text-sm"} mt-2`}>All balances are settled</p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-2.5">
          {summary.map((item, index) => (
            <div
              key={`${item.from}-${item.to}-${index}`}
              className={`border-2 ${itemPadding} rounded-lg sm:rounded-xl transition-all duration-300 ${
                isDark 
                  ? 'bg-dark-bg/50 border-gray-800 hover:border-gray-700' 
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className={`${compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"} leading-relaxed flex-1 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  <span className="font-semibold">{item.from}</span>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}> owes </span>
                  <span className="font-semibold">{item.to}</span>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}> </span>
                  <span className="font-bold">₹{Number(item.amount).toFixed(2)}</span>
                </p>
                {isAdmin && onSettleUp && (
                  <button
                    onClick={() => onSettleUp(item.from, item.to, item.amount)}
                    className={`${compact ? "p-1.5" : "p-2"} rounded-lg transition-all duration-300 flex-shrink-0 ${
                      isDark 
                        ? 'bg-green-700/20 hover:bg-green-700/30 text-green-700' 
                        : 'bg-green-100 hover:bg-green-200 text-green-600'
                    }`}
                    title="Settle Up"
                  >
                    <HandCoins className={compact ? "w-4 h-4" : "w-4 h-4 sm:w-5 sm:h-5"} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SummaryComponent;