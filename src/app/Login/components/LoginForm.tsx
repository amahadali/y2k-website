// src/app/Login/components/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
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

    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      onLoginSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
      <div className="mb-4">
        <label className="block text-gray-400 text-sm mb-2" htmlFor="username">
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
        <label className="block text-gray-400 text-sm mb-2" htmlFor="password">
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
  );
};

export default LoginForm;
