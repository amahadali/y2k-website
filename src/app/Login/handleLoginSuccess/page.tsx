"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HandleLoginSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home page or another page
    router.push("/HomePage");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <p>Redirecting...</p>
    </div>
  );
}
