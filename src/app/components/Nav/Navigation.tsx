"use client";

import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import ElementPopup from "./components/ElementPopup";
import ClusterPopup from "./components/LibraryPopup";
import { useSession } from "next-auth/react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isElementPopupOpen, setIsElementPopupOpen] = useState(false);
  const [isClusterPopupOpen, setIsClusterPopupOpen] = useState(false);
  const [category, setCategory] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);

  const openElementPopup = () => setIsElementPopupOpen(true);
  const closeElementPopup = () => setIsElementPopupOpen(false);

  const openClusterPopup = () => setIsClusterPopupOpen(true);
  const closeClusterPopup = () => setIsClusterPopupOpen(false);

  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated" || status === "unauthenticated") {
      // Trigger a re-render by changing the refreshKey
      setRefreshKey((prevKey) => prevKey + 1);
    }
  }, [status]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar
        key={refreshKey}
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
