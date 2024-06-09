// src/app/HomePage/page.tsx

"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Feed from "./components/Feed";
import ClusterPopup from "./components/ClusterPopup";
import ElementPopup from "./components/ElementPopup";

export default function HomePage() {
  const [showClusterPopup, setShowClusterPopup] = useState(false);
  const [showElementPopup, setShowElementPopup] = useState(false);
  const [category, setCategory] = useState("");

  const openClusterPopup = () => setShowClusterPopup(true);
  const closeClusterPopup = () => setShowClusterPopup(false);

  const openElementPopup = () => setShowElementPopup(true);
  const closeElementPopup = () => {
    setShowElementPopup(false);
    setCategory("");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar
        openClusterPopup={openClusterPopup}
        openElementPopup={openElementPopup}
      />
      <nav className="flex justify-center space-x-4 mt-8">
        <button className="text-white text-lg px-4 py-2 bg-gray-800 rounded-md cursor-pointer">
          Featured
        </button>
        <button className="text-white text-lg px-4 py-2 bg-gray-800 rounded-md cursor-pointer">
          Following
        </button>
      </nav>
      <Feed />
      {showClusterPopup && (
        <ClusterPopup closeClusterPopup={closeClusterPopup} />
      )}
      {showElementPopup && (
        <ElementPopup
          closeElementPopup={closeElementPopup}
          category={category}
          setCategory={setCategory}
        />
      )}
    </div>
  );
}
