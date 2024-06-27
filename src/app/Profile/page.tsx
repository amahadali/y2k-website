// src/app/profile/page.tsx
import React from "react";
import Layout from "../components/Navigation";

const ProfilePage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
            {/* Placeholder for profile image */}
          </div>
          <div>
            <h1 className="text-3xl">User Name</h1>
            <p className="text-gray-400">User bio or description goes here.</p>
          </div>
        </div>
        {/* User's posts or other content */}
      </div>
    </Layout>
  );
};

export default ProfilePage;
