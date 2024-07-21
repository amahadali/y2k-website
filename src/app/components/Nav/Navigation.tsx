// src/Nav/Navigation.tsx
"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "./components/Navbar";
import ElementPopup from "./components/ElementPopup";
import ClusterPopup from "./components/LibraryPopup";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isElementPopupOpen, setIsElementPopupOpen] = useState(false);
  const [isClusterPopupOpen, setIsClusterPopupOpen] = useState(false);
  const [category, setCategory] = useState<string>("");

  const openElementPopup = () => setIsElementPopupOpen(true);
  const closeElementPopup = () => setIsElementPopupOpen(false);

  const openClusterPopup = () => setIsClusterPopupOpen(true);
  const closeClusterPopup = () => setIsClusterPopupOpen(false);

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
