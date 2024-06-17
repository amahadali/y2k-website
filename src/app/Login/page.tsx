// src/app/Login/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Store the token in cookies
        document.cookie = `token=${data.token}; path=/;`;
        console.log("Token set in cookies:", data.token);

        // Redirect to HomePage
        router.push("/HomePage");
      } else {
        setError(data.message);
        console.log("Login failed:", data.message);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.log("Error during login:", error);
    }
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
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-75"></div>
      <div className="flex items-center justify-center min-h-screen relative z-10">
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-sm">
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
          <form onSubmit={handleSubmit}>
            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
