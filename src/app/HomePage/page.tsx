"use client";

import { useSession } from "next-auth/react";
import Feed from "../components/Feed/Feed";
import Layout from "../components/Nav/Navigation";

export default function HomePage() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (loading) {
    return <div>Loading...</div>; // or a loading spinner
  }

  return (
    <Layout>
      <nav className="flex justify-center space-x-4 mt-8">
        <button className="text-white text-lg px-4 py-2 bg-gray-800 rounded-md cursor-pointer">
          Feed
        </button>
        <button className="text-white text-lg px-4 py-2 bg-gray-800 rounded-md cursor-pointer">
          Explore
        </button>
      </nav>
      <Feed />
    </Layout>
  );
}
