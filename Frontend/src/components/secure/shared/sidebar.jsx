// Sidebar.jsx
import React, { useState } from 'react';
import { Users, UserPlus, Settings, User, Heart, Sun, Moon, LogOut, X, Menu } from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';
import logo from '../../../assets/cropped_image.png';

const Sidebar = ({ isOpen, isDark, toggleTheme, toggleSidebar }) => {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
      Cookies.remove("authToken");
      window.location.reload(true);
    };

    const handleLogoClick = () => {
      navigate('/home');
    };
  const sidebarItems = [
    { icon: Users, label: 'Groups', position: 'top', id: 'home' },
    { icon: Heart, label: 'Friends', position: 'top', id: 'friends' },
    { icon: Settings, label: 'Settings', position: 'bottom', id: 'settings' },
    { icon: isDark ? Sun : Moon, label: isDark ? 'Light Mode' : 'Dark Mode', position: 'bottom', id: 'theme', isAction: true, action: toggleTheme },
    { icon: LogOut, label: 'Logout', position: 'bottom', id: 'logout', isAction: true, action: () => setShowLogoutModal(true) },
  ];

  const topItems = sidebarItems.filter(item => item.position === 'top');
  const bottomItems = sidebarItems.filter(item => item.position === 'bottom');

  const handleItemClick = (itemId) => {
    navigate(`/${itemId}`);
  };

  return (
    <aside className={`
      hidden md:flex fixed left-0 top-0 bottom-0 z-40 flex-col
      ${isOpen ? 'w-56' : 'w-16'} 
      ${isDark ? 'bg-dark-bg border-dark-border' : 'bg-white border-gray-200'} 
      border-r transition-all duration-300
    `}>
      {/* Logo Section */}
      <div className={`py-3 px-3 flex justify-center ${isDark ? 'border-b border-dark-border' : 'border-b border-gray-200'}`}>
        <button
          onClick={handleLogoClick}
          className={`
            flex items-center px-3 py-2 rounded-lg hover:opacity-80 transition-opacity
            ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}
          `}
        >
          <img src={logo} className="w-6 h-6 flex-shrink-0" alt="Split Money Logo" />
          {isOpen && (
            <span className={`ml-2 text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Split Money
            </span>
          )}
        </button>
      </div>

      {/* Top Items */}
      <div className="flex-1 py-3">
        <nav className="space-y-1 px-2">
          {topItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`
                w-full flex items-center px-3 py-2 rounded-lg text-left
                ${isDark ? 'hover:bg-gray-800 text-gray-300 hover:text-white' : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'}
                transition-colors group
              `}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && (
                <span className="ml-2 text-sm font-medium">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Collapse Button */}
      <div className={`px-2 py-2 ${isDark ? 'border-t border-dark-border' : 'border-t border-gray-200'}`}>
        <button
          onClick={toggleSidebar}
          className={`w-full flex items-center px-3 py-2 rounded-lg flex-shrink-0 ${
            isDark ? 'hover:bg-gray-800 text-gray-300 hover:text-white' : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
          } transition-colors`}
          title="Collapse/Expand"
        >
          <Menu className="w-5 h-5 flex-shrink-0" />
          {isOpen && (
            <span className="ml-2 text-sm font-medium">Collapse</span>
          )}
        </button>
      </div>

      {/* Bottom Items */}
      <div className="pb-3">
        <nav className="space-y-1 px-2">
          {bottomItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.isAction ? item.action() : handleItemClick(item.id)}
              className={`
                w-full flex items-center px-3 py-2 rounded-lg text-left
                ${isDark ? 'hover:bg-gray-800 text-gray-300 hover:text-white' : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'}
                transition-colors group
              `}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && (
                <span className="ml-2 text-sm font-medium">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

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
    </aside>
  );
};

export default Sidebar;