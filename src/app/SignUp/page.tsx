"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import SignupForm from "./components/SignupForm";

export default function Signup() {
  const router = useRouter();

  const handleSignupSuccess = () => {
    router.push("/HomePage");
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
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-90"></div>
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
            <h2 className="text-2xl text-white">Welcome to Y2KDL</h2>
            <p className="text-gray-400">Begin by creating an account</p>
          </div>
          <SignupForm onSignupSuccess={handleSignupSuccess} />
        </div>
      </div>
    </div>
  );
}
