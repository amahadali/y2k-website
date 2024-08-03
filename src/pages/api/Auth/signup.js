import { hash } from "bcryptjs"; // Import hash function from bcryptjs for password hashing
import dbConnect from "../../../../lib/dbConnect"; // Import database connection utility
import User from "../../../../models/User"; // Import the User model for database operations

// Default export function to handle API requests for user signup
export default async function handler(req, res) {
  const { method } = req; // Extract HTTP method from the request

  // Ensure connection to the database
  await dbConnect();

  // Handle different HTTP methods
  switch (method) {
    case "POST": // Handle POST requests for user signup
      try {
        // Extract user details from the request body
        const { username, email, password } = req.body;

        // Check if a user with the given username or email already exists
        const existingUser = await User.findOne({
          $or: [{ username }, { email }],
        });

        // If user exists, respond with an error
        if (existingUser) {
          return res
            .status(400)
            .json({ success: false, message: "User already exists" });
        }

        // Hash the provided password using bcryptjs
        const hashedPassword = await hash(password, 10);

        // Create a new user instance with the hashed password
        const user = new User({ username, email, password: hashedPassword });
        await user.save(); // Save the new user to the database

        // Respond with a success message and a 201 status code
        return res
          .status(201)
          .json({ success: true, message: "User created successfully" });
      } catch (error) {
        // Handle any errors that occur during the process
        return res.status(500).json({ success: false, message: error.message });
      }
    default:
      // Handle unsupported HTTP methods
      res.setHeader("Allow", ["POST"]); // Set allowed methods in response header
      return res.status(405).end(`Method ${method} Not Allowed`); // Respond with 405 Method Not Allowed
  }
}
