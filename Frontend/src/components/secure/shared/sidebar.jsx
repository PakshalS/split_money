// Sidebar.jsx
import React from 'react';
import { Users, UserPlus, Settings, User, Heart } from 'lucide-react';
import {useNavigate} from 'react-router-dom';

const Sidebar = ({ isOpen, isDark }) => {
    const navigate = useNavigate();
  const sidebarItems = [
    { icon: Users, label: 'Groups', position: 'top', id: 'home' },
    { icon: Heart, label: 'Friends', position: 'top', id: 'friends' },
    { icon: Settings, label: 'Settings', position: 'bottom', id: 'settings' },
  ];

  const topItems = sidebarItems.filter(item => item.position === 'top');
  const bottomItems = sidebarItems.filter(item => item.position === 'bottom');

  const handleItemClick = (itemId) => {
    navigate(`/${itemId}`);
  };

  return (
    <aside className={`
      hidden md:flex fixed left-0 top-16 bottom-0 z-40 flex-col
      ${isOpen ? 'w-64' : 'w-16'} 
      ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} 
      border-r transition-all duration-300
    `}>
      {/* Top Items */}
      <div className="flex-1 py-6">
        <nav className="space-y-2 px-3">
          {topItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`
                w-full flex items-center px-3 py-3 rounded-lg text-left
                ${isDark ? 'hover:bg-gray-800 text-gray-300 hover:text-white' : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'}
                transition-colors group
              `}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && (
                <span className="ml-3 text-sm font-medium">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Items */}
      <div className="pb-6">
        <nav className="space-y-2 px-3">
          {bottomItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`
                w-full flex items-center px-3 py-3 rounded-lg text-left
                ${isDark ? 'hover:bg-gray-800 text-gray-300 hover:text-white' : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'}
                transition-colors group
              `}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && (
                <span className="ml-3 text-sm font-medium">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;