"use client";

import { useState } from "react";

export default function HomePage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  return (
    <div className="min-h-screen bg-black text-white">
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
          <button className="px-4 py-2 bg-gray-800 text-white rounded-full focus:outline-none">
            Create
          </button>
          <div className="relative">
            <div
              className="w-8 h-8 bg-gray-600 rounded-full cursor-pointer"
              onClick={toggleProfileDropdown}
            ></div>
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-2 z-20">
                <div className="flex flex-col items-center p-4">
                  <div className="w-16 h-16 bg-gray-600 rounded-full mb-2"></div>
                  <p className="text-white">Jim Milton</p>
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
                <button className="block px-4 py-2 text-sm text-white hover:bg-gray-700 w-full text-left">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <nav className="flex justify-center space-x-4 mt-8">
        <button className="text-white text-lg px-4 py-2 bg-gray-800 rounded-md cursor-pointer">
          Music
        </button>
        <button className="text-white text-lg px-4 py-2 bg-gray-800 rounded-md cursor-pointer">
          Ringtones
        </button>
        <button className="text-white text-lg px-4 py-2 bg-gray-800 rounded-md cursor-pointer">
          Wallpapers
        </button>
        <button className="text-white text-lg px-4 py-2 bg-gray-800 rounded-md cursor-pointer">
          Games
        </button>
        <button className="text-white text-lg px-4 py-2 bg-gray-800 rounded-md cursor-pointer">
          Software
        </button>
      </nav>

      <main className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4">
            <div className="h-48 bg-gray-700 rounded-md mb-4"></div>
            <h3 className="text-xl mb-2">Album Title</h3>
            <p className="text-gray-400">Artist Name</p>
          </div>
        ))}
      </main>
    </div>
  );
}
