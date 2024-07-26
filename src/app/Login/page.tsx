"use client";

import Image from "next/image";
import Link from "next/link";
import LoginForm from "./components/LoginForm";

export default function Login() {
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
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
