"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

// Define the props expected by the SignupForm component
interface SignupFormProps {
  onSignupSuccess: () => void; // Callback function to handle post-signup actions
}

// Functional component for the signup form
const SignupForm: React.FC<SignupFormProps> = ({ onSignupSuccess }) => {
  // State hooks to manage form fields and error messages
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission behavior
    setError(null); // Reset any previous errors

    try {
      // Send signup data to the server
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      // Check if the signup request was successful
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      const data = await response.json();

      // Handle successful signup
      if (data.success) {
        // Automatically sign in the user after successful registration
        const result = await signIn("credentials", {
          redirect: false,
          username,
          password,
        });

        if (result?.error) {
          setError(result.error); // Handle sign-in error
        } else {
          onSignupSuccess(); // Call the parent callback function
        }
      } else {
        setError(data.message); // Set error message if signup was unsuccessful
        console.log("Signup failed:", data.message);
      }
    } catch (err) {
      // Handle unexpected errors
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
      {/* Display error message if any */}
      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

      {/* Input field for username */}
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

      {/* Input field for email */}
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

      {/* Input field for password with visibility toggle */}
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

      {/* Checkbox for terms and conditions */}
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

      {/* Submit button for the form */}
      <div className="mb-4">
        <button
          className="w-full px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="submit"
        >
          Continue
        </button>
      </div>

      {/* Button for signing up with Google */}
      <div className="mb-4">
        <button
          onClick={() => signIn("google", { callbackUrl: "/HomePage" })}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="button"
        >
          Sign up with Google
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
