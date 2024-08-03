// src/app/Login/page.tsx

"use client"; // Indicate that this component is a client-side React component

import Image from "next/image"; // Import Image component for optimized image handling
import Link from "next/link"; // Import Link component for client-side navigation
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import LoginForm from "./components/LoginForm"; // Import the LoginForm component

export default function Login() {
  const router = useRouter(); // Initialize router for navigation

  // Function to handle successful login
  const handleLoginSuccess = () => {
    router.push("/HomePage"); // Redirect user to HomePage upon successful login
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
      {/* Dark overlay to improve readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-75"></div>
      <div className="flex items-center justify-center min-h-screen relative z-10">
        {/* Form container with semi-transparent background */}
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-sm">
          <div className="flex flex-col items-center mb-6">
            {/* Logo image */}
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={120}
              height={120}
              className="mb-4"
            />
            {/* Login header and description */}
            <h2 className="text-2xl text-white">Log in</h2>
            <p className="text-gray-500 text-sm mt-2">
              or{" "}
              <Link href="/SignUp" className="text-blue-500">
                create an account
              </Link>
            </p>
          </div>
          {/* LoginForm component with success handler */}
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    </div>
  );
}
