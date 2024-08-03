import dbConnect from "../../../../lib/dbConnect"; // Import database connection utility
import Library from "../../../../models/Library"; // Import the Library model for database operations
import { getToken } from "next-auth/jwt"; // Import token utility for authentication

export default async function handler(req, res) {
  await dbConnect(); // Ensure a connection to the database

  // Retrieve and verify the JWT token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    console.error("Authentication required");
    return res.status(401).json({ message: "Authentication required" });
  }

  const userId = token.sub; // Extract the user ID from the token

  switch (req.method) {
    case "DELETE":
      try {
        const { id } = req.query;
        const library = await Library.findById(id);
        if (!library) {
          return res
            .status(404)
            .json({ success: false, message: "Library not found" });
        }

        if (library.user.toString() !== userId) {
          return res
            .status(403)
            .json({ success: false, message: "Unauthorized" });
        }

        await Library.deleteOne({ _id: id });
        res.status(200).json({ success: true, message: "Library deleted" });
      } catch (error) {
        console.error("Error deleting library:", error);
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    case "PATCH":
      try {
        const { id } = req.query;
        const { postId, action } = req.body;

        if (!postId) {
          return res
            .status(400)
            .json({ success: false, message: "Post ID is required" });
        }

        const library = await Library.findById(id);

        if (!library) {
          return res
            .status(404)
            .json({ success: false, message: "Library not found" });
        }

        if (library.user.toString() !== userId) {
          return res
            .status(403)
            .json({ success: false, message: "Unauthorized" });
        }

        // Add or remove post from the library based on action
        if (action === "add") {
          if (!library.posts.includes(postId)) {
            library.posts.push(postId);
          }
        } else if (action === "remove") {
          library.posts.pull(postId);
        } else {
          return res
            .status(400)
            .json({ success: false, message: "Invalid action" });
        }

        await library.save();
        res.status(200).json({ success: true, data: library });
      } catch (error) {
        console.error("Error updating library:", error);
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    case "POST":
      try {
        const { id } = req.body;
        const library = await Library.findById(id).populate("posts");
        if (!library) {
          return res
            .status(404)
            .json({ success: false, message: "Library not found" });
        }

        res.status(200).json({ success: true, data: library });
      } catch (error) {
        console.error("Error fetching library:", error);
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    default:
      // Handle unsupported HTTP methods
      res.setHeader("Allow", ["PATCH", "POST", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
