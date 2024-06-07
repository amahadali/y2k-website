"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link from next/link

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black relative">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/videos/backround_login.mp4"
        autoPlay
        loop
        muted
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-75"></div>{" "}
      {/* Dark overlay */}
      <div className="flex items-center justify-center min-h-screen relative z-10">
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-sm">
          {" "}
          {/* Adjusted for transparency */}
          <div className="flex flex-col items-center mb-6">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={120}
              height={120}
              className="mb-4"
            />
            <h2 className="text-2xl text-white">Log in</h2>
            <a href="#" className="text-gray-500 text-sm mt-2">
              or{" "}
              <Link href="/SignUp" className="text-blue-500">
                create an account
              </Link>
            </a>
          </div>
          <form>
            <div className="mb-4">
              <label
                className="block text-gray-400 text-sm mb-2"
                htmlFor="username"
              >
                Email or username
              </label>
              <input
                className="w-full px-3 py-2 text-gray-900 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="username"
                name="username"
                required
              />
            </div>
            <div className="mb-4 relative">
              <label
                className="block text-gray-400 text-sm mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative w-full">
                <input
                  className="w-full px-3 py-2 text-gray-900 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 py-2 text-gray-500 focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <button
                className="w-full px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="submit"
              >
                Enter
              </button>
            </div>
            <div className="text-center">
              <Link href="/ForgotPassword" className="text-gray-500 text-sm">
                {" "}
                {/* Use Link to navigate */}
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
