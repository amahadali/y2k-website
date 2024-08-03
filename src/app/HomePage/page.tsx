"use client"; // Indicate that this component is a client-side React component

import { useSession } from "next-auth/react"; // Import useSession hook from NextAuth for authentication session management
import Feed from "../components/Feed/Feed"; // Import the Feed component for displaying user content
import Layout from "../components/Nav/Navigation"; // Import the Layout component for wrapping page content

// Define the HomePage functional component
export default function HomePage() {
  // Get the session data and status from useSession hook
  const { data: session, status } = useSession();
  const loading = status === "loading"; // Determine if session data is still loading

  // Display a loading message or spinner if the session data is still loading
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      {/* Navigation section */}
      <nav className="flex justify-center mt-8">
        {/* Navigation button styled as a pill */}
        <div className="relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-full shadow-md">
          <span className="absolute inset-0 rounded-full bg-gray-900 opacity-60"></span>{" "}
          {/* Darker background for button */}
          <span className="relative">Feed</span> {/* Button text */}
        </div>
      </nav>
      {/* Feed component for displaying content */}
      <Feed />
    </Layout>
  );
}
