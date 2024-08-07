import dbConnect from "../../../../lib/dbConnect"; // Import database connection utility
import Library from "../../../../models/Library"; // Import the Library model for database operations
import User from "../../../../models/User"; // Import the User model for database operations
import { getToken } from "next-auth/jwt"; // Import token utility for authentication

export default async function handler(req, res) {
  await dbConnect(); // Ensure a connection to the database

  // Retrieve and verify the JWT token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return res.status(401).json({ message: "Authentication required" }); // Return unauthorized if no token is found
  }

  switch (req.method) {
    case "POST":
      try {
        const { username } = req.body;
        let user;

        // Fetch user either by username or by token ID
        if (username) {
          user = await User.findOne({ username });
          if (!user) {
            return res
              .status(404)
              .json({ success: false, message: "User not found" }); // Return error if user is not found
          }
        } else {
          user = await User.findById(token.sub);
        }

        // Fetch libraries for the user and limit the number of posts retrieved for thumbnails
        const libraries = await Library.find({ user: user._id }).populate({
          path: "posts",
          options: { limit: 3 }, // Get the first 3 posts for thumbnails
        });

        // Map libraries to include post thumbnails
        const librariesWithThumbnails = libraries.map((library) => ({
          ...library.toObject(),
          thumbnails: library.posts.slice(0, 3).map((post) => post.imageUrl),
        }));

        res.status(200).json({ success: true, data: librariesWithThumbnails });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message }); // Return error message if something goes wrong
      }
      break;

    case "PUT":
      try {
        const userId = token.sub; // Extract user ID from the token
        const { name, description, isPrivate } = req.body;

        // Create and save a new library
        const newLibrary = new Library({
          name,
          description,
          isPrivate,
          user: userId,
        });
        const savedLibrary = await newLibrary.save();
        res.status(201).json({ success: true, data: savedLibrary }); // Return created library data
      } catch (error) {
        res.status(500).json({ success: false, message: error.message }); // Return error message if something goes wrong
      }
      break;

    default:
      // Handle unsupported HTTP methods
      res.setHeader("Allow", ["POST", "PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
