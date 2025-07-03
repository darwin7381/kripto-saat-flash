"use client";

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: (isDark: boolean) => void;
  className?: string;
}

export default function DarkModeToggle({ 
  isDarkMode, 
  onToggle, 
  className = "" 
}: DarkModeToggleProps) {
  return (
    <div className={`jeg_nav_col jeg_nav_right ${className}`}>
      <div className="item_wrap jeg_nav_alignright">
        <div className="jeg_nav_item jeg_dark_mode">
          <label className="dark_mode_switch flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="jeg_dark_mode_toggle sr-only"
              checked={isDarkMode}
              onChange={(e) => onToggle(e.target.checked)}
              aria-label="Dark mode toggle"
            />
            <div className="relative">
              {/* Toggle Background */}
              <div 
                className={`block w-12 h-6 rounded-full transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-400' : 'bg-gray-600'
                }`}
              ></div>
              {/* Toggle Circle with Icon */}
              <div 
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 flex items-center justify-center ${
                  isDarkMode ? 'transform translate-x-6' : 'translate-x-0.5'
                }`}
              >
                <i 
                  className={`fa ${isDarkMode ? 'fa-sun-o' : 'fa-moon-o'} text-xs`}
                  style={{ color: isDarkMode ? '#f59e0b' : '#6b7280' }}
                ></i>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
} 