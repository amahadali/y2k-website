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
      <nav className="flex justify-center mt-8">
        <div className="relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-full shadow-md">
          <span className="absolute inset-0 rounded-full bg-gray-900 opacity-60"></span>
          <span className="relative">Feed</span>
        </div>
      </nav>
      <Feed />
    </Layout>
  );
}
