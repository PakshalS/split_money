import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const FriendManagementSkeleton = () => (
  <div className="min-h-screen bg-gray-950 pt-24 text-white flex flex-col items-center p-4">
    <div className="w-full max-w-6xl space-y-6">
      {/* Send Request Skeleton */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl sm:rounded-2xl p-5 shadow-2xl border border-gray-800">
        <Skeleton baseColor="#1f2937" highlightColor="#374151" height={30} width={200} className="mb-4" />
        <Skeleton baseColor="#1f2937" highlightColor="#374151" height={50} />
      </div>

      {/* Two Column Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl sm:rounded-2xl p-5 shadow-2xl border border-gray-800">
            <Skeleton baseColor="#1f2937" highlightColor="#374151" height={30} width={150} className="mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} baseColor="#1f2937" highlightColor="#374151" height={60} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);