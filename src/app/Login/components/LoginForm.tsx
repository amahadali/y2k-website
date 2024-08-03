// src/app/Login/components/LoginForm.tsx

"use client"; // Indicate that this component runs on the client side

import { useState } from "react"; // Import useState for managing local state
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { signIn } from "next-auth/react"; // Import signIn function for authentication
import Link from "next/link"; // Import Link for client-side navigation

interface LoginFormProps {
  onLoginSuccess: () => void; // Prop to handle login success
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  // State hooks for managing form inputs and error messages
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [username, setUsername] = useState(""); // Manage username input
  const [password, setPassword] = useState(""); // Manage password input
  const [error, setError] = useState<string | null>(null); // Manage error messages
  const router = useRouter(); // Hook for navigation

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission behavior
    setError(null); // Clear previous errors

    // Sign in with credentials and handle the result
    const result = await signIn("credentials", {
      redirect: false, // Prevent redirection on sign-in
      username,
      password,
    });

    if (result?.error) {
      // Set error message if sign-in fails
      setError(result.error);
    } else {
      // Call onLoginSuccess prop if sign-in is successful
      onLoginSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Display error message if there is an error */}
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
            type={showPassword ? "text" : "password"} // Show password if state is true
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 py-2 text-gray-500 focus:outline-none"
            onClick={togglePasswordVisibility} // Toggle password visibility on click
          >
            {showPassword ? "Hide" : "Show"}{" "}
            {/* Button text based on visibility state */}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <button
          className="w-full px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="submit" // Submit the form
        >
          Enter
        </button>
      </div>

      <div className="mb-4">
        <button
          onClick={() => signIn("google", { callbackUrl: "/HomePage" })} // Sign in with Google and redirect
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="button" // Button type to prevent form submission
        >
          Sign in with Google
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
