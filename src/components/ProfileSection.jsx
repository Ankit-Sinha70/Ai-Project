import React, { useState, useEffect, useRef } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import {
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiArrowUpCircle,
  FiSliders,
  FiCommand,
  FiFileText,
  FiShield,
  FiDownloadCloud,
  FiChevronDown,
} from "react-icons/fi";
import Modal from './Modal';

// It's good practice to store sensitive keys like this in environment variables
// For now, we'll keep it here, but consider moving it to a .env file.
const GOOGLE_CLIENT_ID = "635584767165-arsn9qctmp7trhobdnm1t1nsvrvr8vqu.apps.googleusercontent.com";

const ProfileSection = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  // Effect to load user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("googleUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("googleUser"); // Clear corrupted data
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLoginSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const userData = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      };
      setUser(userData);
      localStorage.setItem("googleUser", JSON.stringify(userData)); // Persist user
      setIsMenuOpen(false); // Close menu on successful login
      console.log("Login successful, user data:", userData);
      // Here you would typically send the token to your backend for verification and session management
    } catch (error) {
      console.error("Error decoding JWT or processing login:", error);
      // Optionally, show an error to the user
    }
  };

  const handleLoginError = () => {
    console.log("Login Failed");
    // Handle login error (e.g., show a notification to the user)
  };

  const requestLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setUser(null);
    localStorage.removeItem("googleUser"); // Clear user from storage
    setIsMenuOpen(false); // Close profile menu
    setShowLogoutConfirm(false); // Close confirmation dialog
    // Add any other logout logic here (e.g., clearing tokens from storage, notifying backend)
    console.log("User logged out after confirmation");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Placeholder URL - replace with the actual Gemini upgrade plan URL if different
  const geminiUpgradeUrl = "https://one.google.com/explore-plan/gemini-advanced?utm_source=gemini&utm_medium=web&utm_campaign=mode_switcher&g1_landing_page=65";

  const menuItems = [
    {
      label: "Upgrade Plan",
      icon: FiArrowUpCircle,
      action: () => {
        window.open(geminiUpgradeUrl, "_blank", "noopener,noreferrer");
        console.log("Redirecting to Upgrade Plan page");
      }
    },
    { label: "Customize Your AI", icon: FiSliders, action: () => console.log("Customize clicked") },
    { label: "Settings", icon: FiSettings, action: () => console.log("Settings clicked") },
    { label: "Keyboard shortcuts", icon: FiCommand, action: () => console.log("Keyboard shortcuts clicked") },
    // --- separator ---
    { type: 'divider' },
    { label: "Help & FAQ", icon: FiHelpCircle, action: () => console.log("Help & FAQ clicked") },
    { label: "Release notes", icon: FiFileText, action: () => console.log("Release notes clicked") },
    { label: "Terms & policies", icon: FiShield, action: () => console.log("Terms & policies clicked") },
    { label: "Get AI search extension", icon: FiDownloadCloud, action: () => console.log("Extension clicked") },
  ];

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="relative w-full">
        <div
          ref={triggerRef}
          onClick={toggleMenu}
          className="flex items-center justify-between p-2 rounded-md hover:bg-gray-700 cursor-pointer w-full"
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
        >
          {user ? (
            <>
              <div className="flex items-center space-x-3">
                <img
                  src={user.picture}
                  alt={user.name || "User"}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium truncate">{user.name || "User"}</span>
              </div>
              <FiChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </>
          ) : (
            <>
              <div className="flex items-center space-x-3">
                <FiUser className="w-8 h-8 text-gray-400 p-1" />
                <span className="text-sm font-medium">Sign In</span>
              </div>
              <FiChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </>
          )}
        </div>

        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 bottom-full mb-2 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 z-50"
          >
            {user ? (
              <>
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-sm font-medium text-white truncate">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
                <nav className="py-1">
                  {menuItems.map((item, index) => (
                    item.type === 'divider' ? (
                      <div key={`divider-${index}`} className="border-t border-gray-700 my-1"></div>
                    ) : (
                    <button
                      key={item.label}
                      onClick={() => { item.action(); setIsMenuOpen(false); }}
                      className="w-full text-left flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                    >
                      <item.icon className="w-5 h-5 mr-3 text-gray-400" />
                      {item.label}
                    </button>
                    )
                  ))}
                </nav>
                <div className="border-t border-gray-700 my-1"></div>
                <button
                  onClick={requestLogout}
                  className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-500 hover:bg-red-600 hover:text-white transition-colors duration-150"
                >
                  <FiLogOut className="w-5 h-5 mr-3" />
                  Log out
                </button>
              </>
            ) : (
              <div className="p-4 flex flex-col items-center">
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginError}
                  theme="filled_black"
                  text="signin_with"
                  shape="rectangular"
                  width="100%"
                  containerProps={{ style: { width: '100%' } }}
                />
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Sign in to sync history and preferences.
                </p>
              </div>
            )}
          </div>
        )}

        <Modal
          isOpen={showLogoutConfirm}
          onClose={cancelLogout}
          title="Confirm Logout"
          zIndex="z-[60]"
          footerContent={
            <>
              <button
                onClick={cancelLogout}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md text-sm font-medium"
              >
                Log out
              </button>
            </>
          }
        >
          <p>Are you sure you want to log out?</p>
        </Modal>
      </div>
    </GoogleOAuthProvider>
  );
};

export default ProfileSection; 