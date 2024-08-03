"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ElementPopup from "./components/ElementPopup";
import ClusterPopup from "./components/LibraryPopup";
import { useSession } from "next-auth/react";

// Layout component definition
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State to manage the visibility of popups and the category for element popup
  const [isElementPopupOpen, setIsElementPopupOpen] = useState(false);
  const [isClusterPopupOpen, setIsClusterPopupOpen] = useState(false);
  const [category, setCategory] = useState<string>("");

  // Session state and loading status from next-auth
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set loading to false when session status is not loading
    if (status !== "loading") {
      setLoading(false);
    }
  }, [status]);

  // Functions to open and close popups
  const openElementPopup = () => setIsElementPopupOpen(true);
  const closeElementPopup = () => setIsElementPopupOpen(false);

  const openClusterPopup = () => setIsClusterPopupOpen(true);
  const closeClusterPopup = () => setIsClusterPopupOpen(false);

  // Render loading state if still loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  // Render the layout with Navbar and main content
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar
        openClusterPopup={openClusterPopup}
        openElementPopup={openElementPopup}
      />
      <main className="flex-1">{children}</main>
      {isElementPopupOpen && (
        <ElementPopup
          closeElementPopup={closeElementPopup}
          category={category}
          setCategory={setCategory}
        />
      )}
      {isClusterPopupOpen && (
        <ClusterPopup closeClusterPopup={closeClusterPopup} />
      )}
    </div>
  );
};

export default Layout;
