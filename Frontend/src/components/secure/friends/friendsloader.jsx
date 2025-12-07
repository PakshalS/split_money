import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const FriendManagementSkeleton = ({ isDark }) => (
  <div className={`min-h-screen pt-24 flex flex-col items-center p-4 ${
    isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'
  }`}>
    <div className="w-full max-w-6xl space-y-6">
      {/* Send Request Skeleton */}
      <div className={`rounded-xl sm:rounded-2xl p-5 shadow-2xl border ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800' 
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
      }`}>
        <Skeleton 
          baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
          highlightColor={isDark ? "#374151" : "#f3f4f6"} 
          height={30} 
          width={200} 
          className="mb-4" 
        />
        <Skeleton 
          baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
          highlightColor={isDark ? "#374151" : "#f3f4f6"} 
          height={50} 
        />
      </div>

      {/* Two Column Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div 
            key={i} 
            className={`rounded-xl sm:rounded-2xl p-5 shadow-2xl border ${
              isDark 
                ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800' 
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
            }`}
          >
            <Skeleton 
              baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
              highlightColor={isDark ? "#374151" : "#f3f4f6"} 
              height={30} 
              width={150} 
              className="mb-4" 
            />
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <Skeleton 
                  key={j} 
                  baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                  highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                  height={60} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);