"use client";

import { useState } from "react";

export default function HomePage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [showClusterPopup, setShowClusterPopup] = useState(false);
  const [showElementPopup, setShowElementPopup] = useState(false);
  const [category, setCategory] = useState("");

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const toggleCreateDropdown = () => {
    setCreateDropdownOpen(!createDropdownOpen);
  };

  const openClusterPopup = () => {
    setShowClusterPopup(true);
    setCreateDropdownOpen(false);
  };

  const closeClusterPopup = () => {
    setShowClusterPopup(false);
  };

  const openElementPopup = () => {
    setShowElementPopup(true);
    setCreateDropdownOpen(false);
  };

  const closeElementPopup = () => {
    setShowElementPopup(false);
    setCategory(""); // Reset category when closing the popup
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
          Featured
        </button>
        <button className="text-white text-lg px-4 py-2 bg-gray-800 rounded-md cursor-pointer">
          Following
        </button>
      </nav>

      <main className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        {/* Songs */}
        {[...Array(4)].map((_, index) => (
          <div key={`song-${index}`} className="bg-gray-800 rounded-lg p-4">
            <div className="h-48 bg-gray-700 rounded-md mb-4"></div>
            <h3 className="text-xl mb-2">Song Title</h3>
            <p className="text-gray-400">Artist Name</p>
          </div>
        ))}

        {/* Ringtones */}
        {[...Array(4)].map((_, index) => (
          <div key={`ringtone-${index}`} className="bg-gray-800 rounded-lg p-4">
            <div className="h-48 bg-gray-700 rounded-md mb-4 flex items-center justify-center">
              <button
                onClick={() => new Audio("/path/to/ringtone.mp3").play()}
                className="bg-gray-900 text-white p-2 rounded-full hover:bg-gray-600 focus:outline-none"
              >
                ▶️
              </button>
            </div>
            <h3 className="text-xl mb-2">Ringtone Title</h3>
            <p className="text-gray-400">amount of seconds</p>
          </div>
        ))}

        {/* Wallpapers */}
        {[...Array(4)].map((_, index) => (
          <div
            key={`wallpaper-${index}`}
            className="bg-gray-800 rounded-lg p-4"
          >
            <div className="h-48 bg-gray-700 rounded-md mb-4"></div>
            <h3 className="text-xl mb-2">Wallpaper Title</h3>
            <p className="text-gray-400">Artist Name</p>
          </div>
        ))}

        {/* Games */}
        {[...Array(4)].map((_, index) => (
          <div key={`game-${index}`} className="bg-gray-800 rounded-lg p-4">
            <div className="h-48 bg-gray-700 rounded-md mb-4"></div>
            <h3 className="text-xl mb-2">Game Title</h3>
            <p className="text-gray-400">Developer Name</p>
          </div>
        ))}
      </main>

      {/* Cluster Popup */}
      {showClusterPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl mb-4">Personal Library</h2>
            <input
              type="text"
              placeholder="Enter Library title..."
              className="w-full px-4 py-2 mb-4 bg-gray-700 text-white rounded-md focus:outline-none"
            />
            <div className="flex items-center mb-4">
              <input type="checkbox" id="make-private" className="mr-2" />
              <label htmlFor="make-private" className="text-gray-400">
                Make Private
              </label>
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                onClick={closeClusterPopup}
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 ml-2">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Element Popup */}
      {showElementPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 shadow-lg w-1/3">
            <h2 className="text-2xl mb-4">Create Element</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Select Category
              </label>
              <select
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="song">Song</option>
                <option value="ringtone">Ringtone</option>
                <option value="wallpaper">Wallpaper</option>
                <option value="game">Game</option>
              </select>
            </div>

            {category && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder={`Enter ${category} name...`}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
                />
              </div>
            )}

            {category === "song" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Artist Name
                </label>
                <input
                  type="text"
                  placeholder="Enter artist name..."
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
                />
                <label className="block text-sm font-medium text-gray-400 mb-2 mt-4">
                  Upload Image
                </label>
                <input
                  type="file"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
                />
              </div>
            )}

            {category === "ringtone" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Upload Ringtone
                </label>
                <input
                  type="file"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
                />
                <label className="block text-sm font-medium text-gray-400 mb-2 mt-4">
                  Upload Image
                </label>
                <input
                  type="file"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
                />
              </div>
            )}

            {category === "wallpaper" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Upload Wallpaper
                </label>
                <input
                  type="file"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
                />
              </div>
            )}

            {category === "game" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Developer Name
                </label>
                <input
                  type="text"
                  placeholder="Enter developer name..."
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
                />
                <label className="block text-sm font-medium text-gray-400 mb-2 mt-4">
                  Upload Image
                </label>
                <input
                  type="file"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
                />
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                onClick={closeElementPopup}
              >
                Close
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 ml-2">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
