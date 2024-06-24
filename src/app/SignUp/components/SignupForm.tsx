"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

interface SignupFormProps {
  onSignupSuccess: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignupSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
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
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      const data = await response.json();

      if (data.success) {
        // Automatically sign in the user after successful registration
        const result = await signIn("credentials", {
          redirect: false,
          username,
          password,
        });

        if (result?.error) {
          setError(result.error);
        } else {
          onSignupSuccess();
        }
      } else {
        setError(data.message);
        console.log("Signup failed:", data.message);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.log("Error during signup:", err.message);
      } else {
        setError("An unknown error occurred. Please try again.");
        console.log("Unknown error during signup:", err);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
      <div className="mb-4">
        <label className="block text-gray-400 text-sm mb-2" htmlFor="username">
          Username
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
      <div className="mb-4">
        <label className="block text-gray-400 text-sm mb-2" htmlFor="email">
          Email
        </label>
        <input
          className="w-full px-3 py-2 text-gray-900 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      <div className="mb-4 flex items-center">
        <input
          className="mr-2"
          type="checkbox"
          id="terms"
          name="terms"
          required
        />
        <label className="text-gray-400 text-sm" htmlFor="terms">
          I have read the{" "}
          <a href="#" className="text-blue-500">
            terms and privacy policy
          </a>
        </label>
      </div>
      <div className="mb-4">
        <button
          className="w-full px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="submit"
        >
          Continue
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
