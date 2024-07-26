"use client";

import { useSession } from "next-auth/react";
import Feed from "../components/Feed/Feed";
import Layout from "../components/Nav/Navigation";

export default function HomePage() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-xl">Loading...</div>{" "}
        {/* You can replace this with a spinner */}
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-xl">You must be logged in to view this page.</div>
      </div>
    );
  }

  return (
    <Layout>
      <nav className="flex justify-center space-x-4 mt-8">
        <button className="text-white text-lg px-4 py-2 bg-gray-800 rounded-md cursor-pointer">
          Feed
        </button>
      </nav>
      <Feed />
    </Layout>
  );
}
