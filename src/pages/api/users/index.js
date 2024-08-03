// pages/api/users/index.js
import dbConnect from "../../../../lib/dbConnect"; // Import database connection utility
import User from "../../../../models/User"; // Import User model
import { getToken } from "next-auth/jwt"; // Import token utility for NextAuth

export default async function handler(req, res) {
  const { method } = req; // Extract HTTP method from request

  await dbConnect(); // Connect to the database

  // Retrieve the authentication token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    console.error("Authentication required"); // Log if authentication token is missing
    return res.status(401).json({ message: "Authentication required" }); // Respond with 401 Unauthorized
  }

  switch (method) {
    case "POST":
      try {
        // Create a new user with data from the request body
        const user = await User.create(req.body);
        // Respond with the created user and 201 status
        res.status(201).json({ success: true, data: user });
      } catch (error) {
        // Handle errors and respond with 400 Bad Request
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
