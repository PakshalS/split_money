// BackgroundWrapper.jsx
import React from 'react';
import { useTheme
    
 } from '../../../context/themeContext';
const BackgroundWrapper = ({ children }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-200 ${
      isDark ? 'bg-dark-bg' : 'bg-white'
    }`}>
      {/* Optional: Add some background decorative elements */}
      <div className={`absolute inset-0 ${
        isDark ? 'bg-dark-bg' : 'bg-gradient-to-br from-white via-gray-50 to-white'
      }`} />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default BackgroundWrapper;