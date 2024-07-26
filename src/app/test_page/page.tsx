// src/app/test_page/page.tsx

"use client"; // Ensure this file is treated as a Client Component

import React from "react";
import { useSession } from "next-auth/react";
import Layout from "./../components/Nav/Navigation"; // Update the path as necessary

const TestPage: React.FC = () => {
  const { data: session, status } = useSession();

  return (
    <Layout>
      <main className="p-4">
        <h1 className="text-2xl mb-4">Test Page</h1>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl mb-2">Session Information:</h2>
          {status === "loading" ? (
            <p>Loading session...</p>
          ) : session ? (
            <pre className="text-white">{JSON.stringify(session, null, 2)}</pre>
          ) : (
            <p>No session data available</p>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default TestPage;
