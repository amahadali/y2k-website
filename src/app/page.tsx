// src/app/page.tsx
import Image from "next/image";

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-black"
      style={{ backgroundImage: "url('/images/backround.jpg')" }}
    >
      <header className="flex justify-center p-4">
        <div className="flex items-center bg-black bg-opacity-75 rounded-full px-6 py-2 shadow-lg">
          <nav className="flex space-x-4 text-sm">
            <a href="#" className="text-green-500">
              Manifesto
            </a>
            <a href="#" className="text-green-500">
              Careers
            </a>
          </nav>
          <div className="flex space-x-4 ml-4">
            <button className="btn btn-outline btn-primary text-green-500 border-green-500 text-sm py-1 px-3">
              Log In
            </button>
            <button className="btn btn-outline btn-secondary text-green-500 border-green-500 text-sm py-1 px-3">
              Sign Up
            </button>
          </div>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center flex-grow p-4 text-green-500">
        <h2 className="text-8xl font-extrabold mt-30">Y2KDL</h2>
        <p className="text-2xl mt-4">A Digital Library for all things Y2K</p>
      </main>
      <footer className="w-full p-4 bg-black bg-opacity-75 text-center text-green-500 mt-auto">
        <p>&copy; 2024 Retro Y2KDL. All rights reserved.</p>
      </footer>
    </div>
  );
}
