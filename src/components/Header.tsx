import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const isLoggedIn = false;

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white flex items-center justify-between px-4 md:px-[120px] py-4 border-b">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/logos/booky_logo.svg" alt="Booky Logo" className="w-10 h-10" />
        <span className="font-extrabold text-xl md:text-display-md text-gray-950 font-sans">
          Booky
        </span>
      </div>

      {/* Search Bar (show after login) */}
      {isLoggedIn && (
        <div className="hidden md:flex flex-1 mx-8">
          {/* ...search bar code... */}
        </div>
      )}

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Before login: show Login/Register */}
        {!isLoggedIn && (
          <>
            <Button
              asChild
              variant="outline"
              className="h-12 px-8 rounded-full border-2 border-[#D1D5DB] text-gray-900 font-bold text-md bg-white hover:bg-gray-100 transition-all shadow-none"
            >
              <Link to="/login">Login</Link>
            </Button>
            <Button
              asChild
              variant="default"
              className="h-12 px-8 bg-[#2563eb] text-white font-bold text-md shadow-none hover:bg-[#1d4ed8] transition-all"
            >
              <Link to="/register">Register</Link>
            </Button>
          </>
        )}

        {/* After login: show search (mobile), cart, profile */}
        {isLoggedIn && (
          <>
            {/* ...existing code... */}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;