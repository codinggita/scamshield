import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 hover:bg-slate-100 hover:scale-105 active:scale-95 dark:hover:bg-slate-800 ${className}`}
      aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        {/* Sun Icon (slides down when dark mode is on, slides up to center when off) */}
        <div
          className={`absolute transform transition-all duration-500 ease-[cubic-bezier(0.87,_0,_0.13,_1)] ${
            isDarkMode 
              ? 'translate-y-8 opacity-0 rotate-90 scale-50' 
              : 'translate-y-0 opacity-100 rotate-0 scale-100 text-amber-500'
          }`}
        >
          <Sun className="w-5 h-5" />
        </div>
        
        {/* Moon Icon (slides up from bottom when dark mode is on, slides down when off) */}
        <div
          className={`absolute transform transition-all duration-500 ease-[cubic-bezier(0.87,_0,_0.13,_1)] ${
            isDarkMode 
              ? 'translate-y-0 opacity-100 rotate-0 scale-100 text-indigo-400' 
              : '-translate-y-8 opacity-0 -rotate-90 scale-50'
          }`}
        >
          <Moon className="w-5 h-5" />
        </div>
      </div>
      
      {/* Background glow effect for active state */}
      <div 
        className={`absolute inset-0 rounded-xl bg-gradient-to-tr transition-opacity duration-500 -z-10 opacity-0 ${
          isDarkMode 
            ? 'from-indigo-500/10 to-purple-500/10 dark:opacity-100' 
            : 'from-amber-400/10 to-orange-500/10 opacity-100 dark:opacity-0'
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
