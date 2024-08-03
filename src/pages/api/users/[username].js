// src/pages/api/users/[username].js
import dbConnect from "../../../../lib/dbConnect"; // Import database connection utility
import User from "../../../../models/User"; // Import User model
import { getToken } from "next-auth/jwt"; // Import token utility for NextAuth

export default async function handler(req, res) {
  const { method } = req; // Extract HTTP method from request
  const { username } = req.query; // Get the username from the query parameters

  await dbConnect(); // Connect to the database

  // Retrieve the authentication token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    console.error("Authentication required"); // Log missing authentication token
    return res.status(401).json({ message: "Authentication required" }); // Respond with 401 Unauthorized
  }

  switch (method) {
    case "POST":
      try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
          return res
            .status(404)
            .json({ success: false, error: "User not found" }); // Respond with 404 Not Found if user does not exist
        }
        // Respond with the user data
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        // Respond with 400 Bad Request if an error occurs
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      // Set allowed methods and respond with 405 Method Not Allowed for unsupported methods
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
