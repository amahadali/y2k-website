import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Updated import for Next.js router

interface NavbarProps {
  openClusterPopup: () => void;
  openElementPopup: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  openClusterPopup,
  openElementPopup,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter(); // Use router for navigation

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleProfileDropdown = () =>
    setProfileDropdownOpen(!profileDropdownOpen);
  const toggleCreateDropdown = () => setCreateDropdownOpen(!createDropdownOpen);

  const handleLogout = () => {
    // Clear the token and username from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    // Redirect to the login page
    router.push("/Login");
  };

  return (
    <header className="flex justify-between items-center p-4 bg-black bg-opacity-90 shadow-lg">
      <div className="flex items-center space-x-4">
        <img
          src="/images/logo.png"
          alt="Logo"
          width={50}
          height={50}
          className="inline-block"
        />
        <div className="relative">
          <button
            className="text-white text-lg flex items-center space-x-2"
            onClick={toggleDropdown}
          >
            <span>Home</span>
          </button>
          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-2 z-20">
              <button className="block px-4 py-2 text-sm text-white hover:bg-gray-700 cursor-pointer">
                Home
              </button>
              <button className="block px-4 py-2 text-sm text-white hover:bg-gray-700 cursor-pointer">
                Explore
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center relative">
        <div className="relative w-1/2">
          <img
            src="/images/search.png"
            alt="Search"
            className="absolute left-3 top-2 w-6 h-6"
          />
          <input
            type="text"
            placeholder="Search Y2KDL..."
            className="pl-10 pr-4 py-2 bg-gray-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 w-full"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            className="px-4 py-2 bg-gray-800 text-white rounded-full focus:outline-none"
            onClick={toggleCreateDropdown}
          >
            Create
          </button>
          {createDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-2 z-20">
              <button
                className="block px-4 py-2 text-sm text-white hover:bg-gray-700 cursor-pointer"
                onClick={openClusterPopup}
              >
                Library
              </button>
              <button
                className="block px-4 py-2 text-sm text-white hover:bg-gray-700 cursor-pointer"
                onClick={openElementPopup}
              >
                Element
              </button>
            </div>
          )}
        </div>
        <div className="relative">
          <div
            className="w-8 h-8 bg-gray-600 rounded-full cursor-pointer"
            onClick={toggleProfileDropdown}
          ></div>
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-2 z-20">
              <div className="flex flex-col items-center p-4">
                <div className="w-16 h-16 bg-gray-600 rounded-full mb-2"></div>
                <p className="text-white">{username || "Loading..."}</p>
                <a href="#" className="text-blue-500 text-sm">
                  View Profile
                </a>
              </div>
              <div className="border-t border-gray-700"></div>
              <button className="block px-4 py-2 text-sm text-white hover:bg-gray-700 w-full text-left">
                Settings
              </button>
              <button className="block px-4 py-2 text-sm text-white hover:bg-gray-700 w-full text-left">
                Invite a Friend
              </button>
              <button className="block px-4 py-2 text-sm text-white hover:bg-gray-700 w-full text-left">
                Send Feedback
              </button>
              <div className="border-t border-gray-700"></div>
              <button
                className="block px-4 py-2 text-sm text-white hover:bg-gray-700 w-full text-left"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;