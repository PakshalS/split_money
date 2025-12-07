import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const GroupDetailsSkeleton = ({ isDark }) => {
  return (
    <div className={`h-full flex flex-col ${
      isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header Skeleton */}
      <div className={`flex-shrink-0 ${
        isDark 
          ? 'bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 border-gray-800' 
          : 'bg-white border-gray-200'
      } border-b shadow-lg`}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Back Button Skeleton (Mobile) */}
            <div className="md:hidden">
              <Skeleton 
                baseColor={isDark ? "#374151" : "#e5e7eb"} 
                highlightColor={isDark ? "#4b5563" : "#f3f4f6"} 
                width={40} 
                height={40} 
                borderRadius={8}
              />
            </div>

            {/* Group Info Skeleton */}
            <div className="flex-1 min-w-0">
              <Skeleton 
                baseColor={isDark ? "#374151" : "#e5e7eb"} 
                highlightColor={isDark ? "#4b5563" : "#f3f4f6"} 
                width={150} 
                height={20} 
                className="mb-1"
              />
              <Skeleton 
                baseColor={isDark ? "#374151" : "#e5e7eb"} 
                highlightColor={isDark ? "#4b5563" : "#f3f4f6"} 
                width={120} 
                height={14}
              />
            </div>

            {/* Action Button Skeleton */}
            <Skeleton 
              baseColor={isDark ? "#374151" : "#e5e7eb"} 
              highlightColor={isDark ? "#4b5563" : "#f3f4f6"} 
              width={100} 
              height={40} 
              borderRadius={8}
            />
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className={`flex-1 overflow-y-auto scrollbar-hide ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="p-4 space-y-4">
          {/* Summary Component Skeleton */}
          <div className={`rounded-2xl p-5 shadow-2xl border ${
            isDark 
              ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800' 
              : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-3 mb-6">
              <Skeleton 
                baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                width={40} 
                height={40} 
                borderRadius={8}
              />
              <Skeleton 
                baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                width={150} 
                height={28}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={`rounded-xl p-4 ${
                    isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'
                  }`}
                >
                  <Skeleton 
                    baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                    highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                    width={100} 
                    height={16} 
                    className="mb-2"
                  />
                  <Skeleton 
                    baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                    highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                    width={120} 
                    height={32}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Expenses Component Skeleton */}
          <div className={`rounded-2xl p-5 shadow-2xl border ${
            isDark 
              ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800' 
              : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-3 mb-6">
              <Skeleton 
                baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                width={40} 
                height={40} 
                borderRadius={8}
              />
              <div className="flex-1">
                <Skeleton 
                  baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                  highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                  width={150} 
                  height={28}
                />
              </div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={`rounded-xl p-4 ${
                    isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <Skeleton 
                      baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                      highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                      width={150} 
                      height={20}
                    />
                    <Skeleton 
                      baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                      highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                      width={80} 
                      height={20}
                    />
                  </div>
                  <Skeleton 
                    baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                    highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                    width={120} 
                    height={16}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Two Column Layout Skeleton */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Balances Skeleton */}
            <div className={`rounded-2xl p-5 shadow-2xl border ${
              isDark 
                ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800' 
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <Skeleton 
                  baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                  highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                  width={40} 
                  height={40} 
                  borderRadius={8}
                />
                <Skeleton 
                  baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                  highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                  width={120} 
                  height={28}
                />
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className={`rounded-xl p-4 ${
                      isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <Skeleton 
                        baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                        highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                        width={100} 
                        height={20}
                      />
                      <Skeleton 
                        baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                        highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                        width={80} 
                        height={24}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Settle Ups Skeleton */}
            <div className={`rounded-2xl p-5 shadow-2xl border ${
              isDark 
                ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800' 
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <Skeleton 
                  baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                  highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                  width={40} 
                  height={40} 
                  borderRadius={8}
                />
                <Skeleton 
                  baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                  highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                  width={120} 
                  height={28}
                />
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className={`rounded-xl p-4 ${
                      isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Skeleton 
                        baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                        highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                        width={120} 
                        height={20}
                      />
                      <Skeleton 
                        baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                        highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                        width={60} 
                        height={20}
                      />
                    </div>
                    <Skeleton 
                      baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                      highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                      width={100} 
                      height={14}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Members Component Skeleton */}
          <div className={`rounded-2xl p-5 shadow-2xl border ${
            isDark 
              ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800' 
              : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-3 mb-6">
              <Skeleton 
                baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                width={40} 
                height={40} 
                borderRadius={8}
              />
              <div className="flex-1">
                <Skeleton 
                  baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                  highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                  width={120} 
                  height={28}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i} 
                  className={`rounded-xl p-4 ${
                    isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'
                  }`}
                >
                  <Skeleton 
                    baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                    highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                    width={100} 
                    height={20} 
                    className="mb-2"
                  />
                  <Skeleton 
                    baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                    highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                    width={120} 
                    height={16}
                  />
                </div>
              ))}
            </div>
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

export default GroupDetailsSkeleton;