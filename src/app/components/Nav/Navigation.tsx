"use client";

import React, { useState } from "react";
import Navbar from "./components/Navbar";
import ElementPopup from "./components/ElementPopup";
import ClusterPopup from "./components/LibraryPopup";
import { useSession } from "next-auth/react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isElementPopupOpen, setIsElementPopupOpen] = useState(false);
  const [isClusterPopupOpen, setIsClusterPopupOpen] = useState(false);
  const [category, setCategory] = useState<string>("");

  const openElementPopup = () => setIsElementPopupOpen(true);
  const closeElementPopup = () => setIsElementPopupOpen(false);

  const openClusterPopup = () => setIsClusterPopupOpen(true);
  const closeClusterPopup = () => setIsClusterPopupOpen(false);

  const { status, data: session } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar
        openClusterPopup={openClusterPopup}
        openElementPopup={openElementPopup}
        session={session}
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
