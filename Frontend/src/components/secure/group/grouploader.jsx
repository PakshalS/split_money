import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const GroupDetailsSkeleton = ({ isDark }) => {
  return (
    <div className={`h-full flex flex-col relative overflow-hidden ${
      isDark ? 'bg-dark-bg text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Group Banner Skeleton */}
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

            {/* Action Buttons Skeleton */}
            <div className="flex gap-2">
              <Skeleton 
                baseColor={isDark ? "#374151" : "#e5e7eb"} 
                highlightColor={isDark ? "#4b5563" : "#f3f4f6"} 
                width={40} 
                height={40} 
                borderRadius={8}
              />
              <Skeleton 
                baseColor={isDark ? "#374151" : "#e5e7eb"} 
                highlightColor={isDark ? "#4b5563" : "#f3f4f6"} 
                width={40} 
                height={40} 
                borderRadius={8}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chat View - Transaction Bubbles Skeleton */}
      <div className={`flex-1 overflow-y-auto scrollbar-hide p-4 ${
        isDark ? 'bg-dark-bg' : 'bg-gray-50'
      }`}>
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Transaction Bubble Skeletons - Mix of left and right aligned */}
          {[1, 2, 3, 4, 5, 6, 7].map((i) => {
            const isRight = i % 3 === 0; // Every 3rd bubble on right (settle-ups)
            return (
              <div
                key={i}
                className={`flex ${isRight ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] sm:max-w-md rounded-2xl p-4 shadow-md ${
                    isRight
                      ? isDark
                        ? 'bg-green-900/30 border border-green-800/50'
                        : 'bg-green-50 border border-green-200'
                      : isDark
                      ? 'bg-gray-800/90 border border-gray-700'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Skeleton
                      baseColor={isDark ? "#1f2937" : "#e5e7eb"}
                      highlightColor={isDark ? "#374151" : "#f3f4f6"}
                      width={120}
                      height={18}
                    />
                    <Skeleton
                      baseColor={isDark ? "#1f2937" : "#e5e7eb"}
                      highlightColor={isDark ? "#374151" : "#f3f4f6"}
                      width={60}
                      height={16}
                    />
                  </div>

                  {/* Description */}
                  <Skeleton
                    baseColor={isDark ? "#1f2937" : "#e5e7eb"}
                    highlightColor={isDark ? "#374151" : "#f3f4f6"}
                    width="90%"
                    height={14}
                    className="mb-2"
                  />

                  {/* Amount & Date */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-700/30">
                    <Skeleton
                      baseColor={isDark ? "#1f2937" : "#e5e7eb"}
                      highlightColor={isDark ? "#374151" : "#f3f4f6"}
                      width={80}
                      height={12}
                    />
                    <Skeleton
                      baseColor={isDark ? "#1f2937" : "#e5e7eb"}
                      highlightColor={isDark ? "#374151" : "#f3f4f6"}
                      width={40}
                      height={12}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Bar Skeleton */}
      <div className={`flex-shrink-0 border-t ${
        isDark ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'
      } backdrop-blur-sm`}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-3 max-w-4xl mx-auto">
            {/* Filter Button Skeleton */}
            <Skeleton
              baseColor={isDark ? "#374151" : "#e5e7eb"}
              highlightColor={isDark ? "#4b5563" : "#f3f4f6"}
              width={100}
              height={40}
              borderRadius={20}
            />

            {/* Add Button Skeleton (Admin only) */}
            <Skeleton
              baseColor={isDark ? "#374151" : "#e5e7eb"}
              highlightColor={isDark ? "#4b5563" : "#f3f4f6"}
              width={120}
              height={44}
              borderRadius={22}
            />
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