"use client"; // Indicate that this component is a client-side React component

import { useState } from "react"; // Import the useState hook from React
import Image from "next/image"; // Import Image component from Next.js for optimized image handling

// Define the ForgotPassword functional component
export default function ForgotPassword() {
  // State to manage the email or username input value
  const [email, setEmail] = useState("");

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    // Handle the forgot password logic here (e.g., send request to server)
  };

  return (
    <div className="min-h-screen flex flex-col bg-black relative">
      {/* Background video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/videos/backround_login.mp4"
        autoPlay
        loop
        muted
      />
      {/* Dark overlay for improved readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-90"></div>
      <div className="flex items-center justify-center min-h-screen relative z-10">
        {/* Form container with semi-transparent background */}
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            {/* Logo image */}
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={120}
              height={120}
              className="mb-4"
            />
            {/* Title and description */}
            <h2 className="text-2xl text-white">Reset password</h2>
            <p className="text-gray-400 text-center">
              Enter your email or username and we’ll send you a link where you
              can reset your password.
            </p>
          </div>
          {/* Form for email/username input */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-400 text-sm mb-2"
                htmlFor="email"
              >
                Email or username
              </label>
              <input
                className="w-full px-3 py-2 text-gray-900 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text" // Input field to accept both email and username
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required // Make this field mandatory
              />
            </div>
            <div className="mb-4">
              <button
                className="w-full px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="submit"
              >
                Send link
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
