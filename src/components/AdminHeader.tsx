import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const AdminHeader: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userName, setUserName] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string>("/images/user_avatar.svg");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updateUser = useCallback(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(user?.name || "Admin");
        setProfilePhoto(user?.profilePhoto || "/images/user_avatar.svg");
      } else {
        setUserName(null);
        setProfilePhoto("/images/user_avatar.svg");
      }
    } catch {
      setUserName(null);
      setProfilePhoto("/images/user_avatar.svg");
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    window.addEventListener("storage", updateUser);
    window.addEventListener("focus", updateUser);
    updateUser();
    return () => {
      window.removeEventListener("storage", updateUser);
      window.removeEventListener("focus", updateUser);
    };
  }, [updateUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName(null);
    setProfilePhoto("/images/user_avatar.svg");
    setShowDropdown(false);
    navigate("/");
  };

  const handleLogoClick = () => {
    navigate("/admin");
  };

  return (
    <header
      className={`fixed z-50 w-full bg-white flex items-center justify-between h-[80px] px-4 md:px-[120px] py-4 border-b border-neutral-100 transition-shadow duration-200 ${
        scrolled ? "shadow-lg" : ""
      }`}
    >
      <button
        className="flex items-center gap-2 focus:outline-none"
        onClick={handleLogoClick}
        aria-label="Back to admin homepage"
        style={{ background: "none", border: "none", padding: 0 }}
      >
        <img src="/logos/booky_logo.svg" alt="Booky Logo" className="w-8 h-8 md:w-10 md:h-10" />
        <span className="font-extrabold text-xl md:text-display-lg text-gray-950 font-sans hidden md:inline">
          Booky
        </span>
      </button>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* User avatar & name + dropdown */}
        {isLoggedIn && (
          <div className="relative flex items-center gap-4" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setShowDropdown((v) => !v)}
            >
              <img
                src={profilePhoto && profilePhoto.trim() !== "" ? profilePhoto : "/images/user_avatar.svg"}
                alt="User"
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="hidden md:inline text-text-lg font-semibold text-gray-900">{userName || "Admin"}</span>
              <img src="/icons/chevron-down.svg" alt="Dropdown" className="w-6 h-6 hidden md:inline" />
            </button>
            {showDropdown && (
              <>
                {/* Desktop dropdown */}
                <div
                  className={`hidden md:block absolute right-0 mt-[220px] w-[184px] bg-white rounded-b-xl shadow-lg border border-gray-200 z-50
                    transition-all duration-500 ease-out
                    ${showDropdown ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"}
                  `}
                >
                  <ul className="py-2">
                    <li>
                      <button className="w-full text-left px-5 py-2 hover:bg-gray-100 text-gray-950 font-semibold">Profile</button>
                    </li>
                    <li>
                      <button className="w-full text-left px-5 py-2 hover:bg-gray-100 text-gray-950 font-semibold">Dashboard</button>
                    </li>
                    <li>
                      <button
                        className="w-full text-left px-5 py-2 hover:bg-gray-100 text-red-500 font-semibold"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
                {/* Mobile dropdown */}
                <div
                  className={`md:hidden fixed left-0 top-[80px] w-full bg-white rounded-b-xl shadow-lg border-t border-gray-200 z-50
                    transition-all duration-500 ease-out
                    ${showDropdown ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"}
                  `}
                >
                  <ul className="py-4">
                    <li>
                      <button className="w-full text-left px-6 py-3 text-lg hover:bg-gray-100 text-gray-900 font-normal">Profile</button>
                    </li>
                    <li>
                      <button className="w-full text-left px-6 py-3 text-lg hover:bg-gray-100 text-gray-900 font-normal">Dashboard</button>
                    </li>
                    <li>
                      <button
                        className="w-full text-left px-6 py-3 text-lg hover:bg-gray-100 text-red-500 font-semibold"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        )}

        {!isLoggedIn && (
          <>
            <Button
              asChild
              variant="outline"
              className="h-[48px] px-8 rounded-full border border-neutral-300 text-neutral-950 font-bold text-text-md bg-white hover:bg-neutral-100 transition-all shadow-none"
            >
              <Link to="/login">Login</Link>
            </Button>
            <Button
              asChild
              variant="default"
              className="h-[48px] px-8 bg-primary-300 text-white font-bold text-text-md shadow-none hover:bg-primary-500 transition-all"
            >
              <Link to="/register">Register</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;