import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const GroupDetailsSkeleton = ({ isDark }) => {
  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navbar Skeleton */}
      <nav className={`fixed top-0 left-0 right-0 z-40 border-b shadow-2xl backdrop-blur-sm animate-fade-in ${
        isDark 
        ? 'bg-gray-800 border-gray-800' 
        :'bg-gray-50 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back Button Skeleton */}
            <div className="flex items-center gap-2 animate-slide-in-left">
              <Skeleton 
                baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                width={80} 
                height={40} 
                borderRadius={8}
                duration={1.5}
                enableAnimation={true}
              />
            </div>

            {/* Center Group Info Skeleton */}
            <div className="flex-1 text-center px-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Skeleton 
                baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                width={200} 
                height={24} 
                className="mx-auto mb-2"
                duration={1.5}
                enableAnimation={true}
              />
              <Skeleton 
                baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                width={150} 
                height={16} 
                className="mx-auto"
                duration={1.5}
                enableAnimation={true}
              />
            </div>

            {/* Action Button Skeleton */}
            <div className="animate-slide-in-right">
              <Skeleton 
                baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                width={100} 
                height={40} 
                borderRadius={12}
                duration={1.5}
                enableAnimation={true}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 p-4 flex flex-col items-center">
        <div className="w-full max-w-6xl space-y-6">
          {/* Summary Component Skeleton */}
          <div className={`rounded-2xl p-5 shadow-2xl border animate-slide-up ${
            isDark 
              ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800' 
              : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
          }`} style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-6">
              <Skeleton 
                baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                width={40} 
                height={40} 
                borderRadius={8}
                duration={1.5}
                enableAnimation={true}
              />
              <div className="flex-1">
                <Skeleton 
                  baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                  highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                  width={150} 
                  height={28}
                  duration={1.5}
                  enableAnimation={true}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={`rounded-xl p-4 animate-scale-in ${
                    isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'
                  }`}
                  style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                >
                  <Skeleton 
                    baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                    highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                    width={100} 
                    height={16} 
                    className="mb-2"
                    duration={1.5}
                    enableAnimation={true}
                  />
                  <Skeleton 
                    baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                    highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                    width={120} 
                    height={32}
                    duration={1.5}
                    enableAnimation={true}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Expenses Component Skeleton */}
          <div className={`rounded-2xl p-5 shadow-2xl border animate-slide-up ${
            isDark 
              ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800' 
              : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
          }`} style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3 mb-6">
              <Skeleton 
                baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                width={40} 
                height={40} 
                borderRadius={8}
                duration={1.5}
                enableAnimation={true}
              />
              <div className="flex-1">
                <Skeleton 
                  baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                  highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                  width={150} 
                  height={28}
                  duration={1.5}
                  enableAnimation={true}
                />
                <Skeleton 
                  baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                  highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                  width={200} 
                  height={16} 
                  className="mt-1"
                  duration={1.5}
                  enableAnimation={true}
                />
              </div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={`rounded-xl p-4 animate-slide-in-left ${
                    isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'
                  }`}
                  style={{ animationDelay: `${0.5 + i * 0.1}s` }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <Skeleton 
                      baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                      highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                      width={150} 
                      height={20}
                      duration={1.5}
                      enableAnimation={true}
                    />
                    <Skeleton 
                      baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                      highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                      width={80} 
                      height={20}
                      duration={1.5}
                      enableAnimation={true}
                    />
                  </div>
                  <Skeleton 
                    baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                    highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                    width={120} 
                    height={16}
                    duration={1.5}
                    enableAnimation={true}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Two Column Layout Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Balances Skeleton */}
            <div className={`rounded-2xl p-5 shadow-2xl border animate-slide-up ${
              isDark 
                ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800' 
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
            }`} style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center gap-3 mb-6">
                <Skeleton 
                  baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                  highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                  width={40} 
                  height={40} 
                  borderRadius={8}
                  duration={1.5}
                  enableAnimation={true}
                />
                <Skeleton 
                  baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                  highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                  width={120} 
                  height={28}
                  duration={1.5}
                  enableAnimation={true}
                />
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className={`rounded-xl p-4 animate-fade-in ${
                      isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'
                    }`}
                    style={{ animationDelay: `${0.7 + i * 0.05}s` }}
                  >
                    <div className="flex justify-between items-center">
                      <Skeleton 
                        baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                        highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                        width={100} 
                        height={20}
                        duration={1.5}
                        enableAnimation={true}
                      />
                      <Skeleton 
                        baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                        highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                        width={80} 
                        height={24}
                        duration={1.5}
                        enableAnimation={true}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Settle Ups Skeleton */}
            <div className={`rounded-2xl p-5 shadow-2xl border animate-slide-up ${
              isDark 
                ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800' 
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
            }`} style={{ animationDelay: '0.7s' }}>
              <div className="flex items-center gap-3 mb-6">
                <Skeleton 
                  baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                  highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                  width={40} 
                  height={40} 
                  borderRadius={8}
                  duration={1.5}
                  enableAnimation={true}
                />
                <Skeleton 
                  baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                  highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                  width={120} 
                  height={28}
                  duration={1.5}
                  enableAnimation={true}
                />
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className={`rounded-xl p-4 animate-fade-in ${
                      isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'
                    }`}
                    style={{ animationDelay: `${0.8 + i * 0.05}s` }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Skeleton 
                        baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                        highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                        width={120} 
                        height={20}
                        duration={1.5}
                        enableAnimation={true}
                      />
                      <Skeleton 
                        baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                        highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                        width={60} 
                        height={20}
                        duration={1.5}
                        enableAnimation={true}
                      />
                    </div>
                    <Skeleton 
                      baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                      highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                      width={100} 
                      height={14}
                      duration={1.5}
                      enableAnimation={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Members Component Skeleton */}
          <div className={`rounded-2xl p-5 shadow-2xl border animate-slide-up ${
            isDark 
              ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800' 
              : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
          }`} style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center gap-3 mb-6">
              <Skeleton 
                baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                width={40} 
                height={40} 
                borderRadius={8}
                duration={1.5}
                enableAnimation={true}
              />
              <div className="flex-1">
                <Skeleton 
                  baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                  highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                  width={120} 
                  height={28}
                  duration={1.5}
                  enableAnimation={true}
                />
                <Skeleton 
                  baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                  highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                  width={150} 
                  height={16} 
                  className="mt-1"
                  duration={1.5}
                  enableAnimation={true}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i} 
                  className={`rounded-xl p-4 animate-scale-in ${
                    isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'
                  }`}
                  style={{ animationDelay: `${0.9 + i * 0.05}s` }}
                >
                  <Skeleton 
                    baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                    highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                    width={100} 
                    height={20} 
                    className="mb-2"
                    duration={1.5}
                    enableAnimation={true}
                  />
                  <Skeleton 
                    baseColor={isDark ? "#1f2937" : "#e5e7eb"} 
                    highlightColor={isDark ? "#374151" : "#f3f4f6"} 
                    width={120} 
                    height={16}
                    duration={1.5}
                    enableAnimation={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scaleIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Smooth transition for skeleton shimmer */
        .react-loading-skeleton {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default GroupDetailsSkeleton;