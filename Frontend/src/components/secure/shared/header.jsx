// Header.jsx
import React, { useState } from 'react';
import { Menu, Sun, Moon, Diamond, User, Sidebar, LogOut, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import logo from '../../../assets/cropped_image.png';

const Header = ({ isSidebarOpen, toggleSidebar, isDark, toggleTheme }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const isGroupPage = location.pathname.startsWith("/groups/");

  const handleLogout = () => {
    Cookies.remove("authToken");
    window.location.reload(true);
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 ${isGroupPage ? 'hidden' : 'md:hidden'} ${isDark ? 'bg-[#1f2329] border-dark-border' : 'bg-white border-gray-200'} border-b`}>
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left side - Logo and sidebar toggle (Desktop/Tablet) */}
          <div className="hidden md:flex items-center space-x-4">
            <div 
              onClick={handleLogoClick}
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img src={logo} className="w-8 h-8" alt="Split Money Logo" />
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Split Money
              </span>
            </div>
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-lg hover:bg-gray-100 ${isDark ? 'hover:bg-gray-800 text-white' : 'text-gray-600'} transition-colors`}
            >
              <Sidebar className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile - App Name */}
          <div 
            onClick={handleLogoClick}
            className="md:hidden flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img src={logo} className="w-8 h-8" alt="Split Money Logo" />
            <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Split Money
            </span>
          </div>

          {/* Right side - Theme toggle and Logout */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg hover:bg-gray-100 ${isDark ? 'hover:bg-gray-800 text-white' : 'text-gray-600'} transition-colors`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowLogoutModal(true)}
              className={`p-2 rounded-lg hover:bg-gray-100 ${isDark ? 'hover:bg-gray-800 text-white' : 'text-gray-600'} transition-colors`}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
          <div className={`relative w-full max-w-md mx-4 p-6 rounded-lg shadow-xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <button
              onClick={() => setShowLogoutModal(false)}
              className={`absolute top-4 right-4 p-1 rounded-lg transition-colors ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X size={20} />
            </button>

            <h2 className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Confirm Logout
            </h2>

            <p className={`mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Are you sure you want to logout?
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;