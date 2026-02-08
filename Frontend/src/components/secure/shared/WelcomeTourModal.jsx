import React from 'react';
import { X, Sparkles, Users, DollarSign, TrendingUp } from 'lucide-react';
import { useTour } from '../../../context/TourContext';
import apiClient from '../../../api/client';

const WelcomeTourModal = ({ isOpen, onClose, isDark }) => {
  const { startTour } = useTour();

  const handleStartTour = () => {
    onClose();
    // Small delay to ensure modal is closed before tour starts
    setTimeout(() => {
      startTour();
    }, 300);
  };

  const handleSkip = async () => {
    onClose();
    try {
      await apiClient.patch('/auth/tour-status', { tourStatus: 'later' });
    } catch (error) {
      console.error('Failed to update tour status:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl ${
          isDark ? 'bg-[#1a1d24]' : 'bg-white'
        } overflow-hidden`}
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            isDark
              ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 px-8 py-12 text-white">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Sparkles className="w-12 h-12" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center mb-2">
            Welcome to Split Money!
          </h2>
          <p className="text-center text-white/90 text-sm">
            Let's take a quick tour to help you get started
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          <p className={`text-center mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            In just 2 minutes, you'll learn how to:
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                <Users className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <div>
                <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Create Groups
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Set up groups for trips, roommates, or events
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <DollarSign className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Track Expenses
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Record who paid and how to split costs
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                <TrendingUp className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <div>
                <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Settle Up
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  See balances and record payments
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleStartTour}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Tour (2 min)
            </button>
            <button
              onClick={handleSkip}
              className={`w-full px-6 py-3 font-medium rounded-lg transition-colors ${
                isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Skip for Now
            </button>
          </div>

          <p className={`text-xs text-center mt-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            You can always start the tour later from Settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeTourModal;
