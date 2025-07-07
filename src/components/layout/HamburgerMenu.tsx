"use client";

interface HamburgerMenuProps {
  onClick: () => void;
  className?: string;
}

export default function HamburgerMenu({ onClick, className = "" }: HamburgerMenuProps) {
  return (
    <div className={`jeg_nav_col jeg_nav_left ${className}`}>
      <div className="item_wrap jeg_nav_alignleft">
        <div className="jeg_nav_item">
          <button 
            onClick={onClick}
            className="hamburger-menu hover:opacity-70 transition-opacity text-white lg:text-gray-800"
            aria-label="Open Menu"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '8px',
              fontWeight: '400'
            }}
          >
            <i className="fa fa-bars"></i>
          </button>
        </div>
      </div>
    </div>
  );
} 