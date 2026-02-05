import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const FriendsListSkeleton = ({ isDark }) => (
  <div className={`h-full flex flex-col ${
    isDark ? 'bg-gray-800' : 'bg-gray-100'
  }`}>
    {/* Search Bar Skeleton */}
    <div className="p-4">
      <Skeleton 
        baseColor={isDark ? "#374151" : "#e5e7eb"} 
        highlightColor={isDark ? "#4b5563" : "#f3f4f6"} 
        height={40} 
        borderRadius={8}
      />
    </div>

    {/* Friends List Skeletons */}
    <div className="flex-1 overflow-hidden">
      <div className="space-y-0">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div 
            key={i} 
            className={`p-4 border-b ${
              isDark ? 'border-gray-700' : 'border-gray-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* Avatar Skeleton */}
              <Skeleton 
                circle 
                width={40} 
                height={40}
                baseColor={isDark ? "#4b5563" : "#e5e7eb"} 
                highlightColor={isDark ? "#6b7280" : "#f3f4f6"} 
              />
              
              {/* Text Content Skeleton */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton 
                    width={120} 
                    height={16}
                    baseColor={isDark ? "#4b5563" : "#e5e7eb"} 
                    highlightColor={isDark ? "#6b7280" : "#f3f4f6"} 
                  />
                  <Skeleton 
                    width={50} 
                    height={12}
                    baseColor={isDark ? "#4b5563" : "#e5e7eb"} 
                    highlightColor={isDark ? "#6b7280" : "#f3f4f6"} 
                  />
                </div>
                <Skeleton 
                  width={80} 
                  height={14}
                  baseColor={isDark ? "#4b5563" : "#e5e7eb"} 
                  highlightColor={isDark ? "#6b7280" : "#f3f4f6"} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default FriendsListSkeleton;
