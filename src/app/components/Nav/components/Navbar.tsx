import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface NavbarProps {
  openClusterPopup: () => void;
  openElementPopup: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  openClusterPopup,
  openElementPopup,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const createDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/Login");
    }
  }, [status, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        createDropdownRef.current &&
        !createDropdownRef.current.contains(event.target as Node)
      ) {
        setCreateDropdownOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCreateDropdown = () => setCreateDropdownOpen((prev) => !prev);
  const toggleProfileDropdown = () => setProfileDropdownOpen((prev) => !prev);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/Login" });
  };

  if (status === "loading") {
    return null; // Optionally, you can show a loader here as well
  }

  return (
    <header className="flex justify-between items-center p-4 bg-black bg-opacity-90 shadow-lg">
      <div className="flex items-center space-x-4">
        <img
          src="/images/logo.png"
          alt="Logo"
          width={50}
          height={50}
          className="inline-block cursor-pointer"
          onClick={() => router.push("/HomePage")}
        />
        <div className="relative">
          <button
            className="text-white text-md flex items-center space-x-2" // Reduced font size
            onClick={() => router.push("/HomePage")}
          >
            <span>Home</span>
          </button>
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
        <div className="relative" ref={createDropdownRef}>
          <button
            className="px-4 py-2 text-sm bg-white text-black rounded-full hover:bg-gray-100 transition-colors duration-300 focus:outline-none"
            onClick={toggleCreateDropdown}
          >
            Create
          </button>
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 mt-2 w-36 bg-gray-800 rounded-md shadow-lg py-1 z-20 transition-opacity duration-300 ease-in-out ${
              createDropdownOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <button
              className="block px-4 py-2 text-sm text-white hover:bg-gray-700 w-full text-center"
              onClick={openClusterPopup}
            >
              Library
            </button>
            <button
              className="block px-4 py-2 text-sm text-white hover:bg-gray-700 w-full text-center"
              onClick={openElementPopup}
            >
              Element
            </button>
          </div>
        </div>
        <div className="relative" ref={profileDropdownRef}>
          <div
            className="w-9 h-9 bg-gray-600 rounded-full cursor-pointer" // Increased profile image size
            onClick={toggleProfileDropdown}
          >
            {session?.user?.profileImage ? (
              <img
                src={session.user.profileImage}
                alt={session.user.username}
                className="w-9 h-9 rounded-full"
              />
            ) : (
              <div className="w-9 h-9 bg-gray-600 rounded-full"></div>
            )}
          </div>
          <div
            className={`absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-2 z-20 transition-opacity duration-300 ease-in-out ${
              profileDropdownOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="flex flex-col items-center p-4">
              {session?.user?.profileImage ? (
                <img
                  src={session.user.profileImage}
                  alt={session.user.username}
                  className="w-16 h-16 rounded-full mb-2"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-600 rounded-full mb-2"></div>
              )}
              <p className="text-white mb-2">
                {session?.user?.username || "Loading..."}
              </p>
              <Link href={`/profile/${session?.user.username}`}>
                <button className="text-white text-sm hover:underline">
                  View Profile
                </button>
              </Link>
            </div>
            <div className="border-t border-gray-700"></div>
            <button
              className="block px-4 py-2 text-sm text-white hover:bg-gray-700 w-full text-left"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
