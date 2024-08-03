import dbConnect from "../../../../lib/dbConnect"; // Import the database connection utility
import Post from "../../../../models/Posts"; // Import the Post model
import User from "../../../../models/User"; // Import the User model
import Game from "../../../../models/Game"; // Import the Game model
import Song from "../../../../models/Song"; // Import the Song model
import Ringtone from "../../../../models/Ringtone"; // Import the Ringtone model
import Wallpaper from "../../../../models/Wallpaper"; // Import the Wallpaper model
import { getToken } from "next-auth/jwt"; // Import the NextAuth token utility

// Map post types to their corresponding models
const modelMapping = {
  game: Game,
  song: Song,
  ringtone: Ringtone,
  wallpaper: Wallpaper,
};

export default async function handler(req, res) {
  const { method } = req; // Extract the HTTP method from the request

  await dbConnect(); // Ensure the database connection is established

  switch (method) {
    case "POST":
      try {
        // Retrieve the authentication token from the request
        const token = await getToken({
          req,
          secret: process.env.NEXTAUTH_SECRET,
        });

        // If no token is found, respond with an authentication error
        if (!token) {
          return res.status(401).json({ message: "Authentication required" });
        }

        const { username, contentId } = req.body; // Extract data from the request body
        let posts;

        if (contentId) {
          // Fetch posts that match the provided contentId
          posts = await Post.find({ contentId }).lean();
          if (!posts || posts.length === 0) {
            return res
              .status(404)
              .json({ success: false, message: "Post not found" });
          }
        } else if (username) {
          // Fetch posts by the provided username
          const user = await User.findOne({ username });
          if (!user) {
            return res
              .status(404)
              .json({ success: false, message: "User not found" });
          }
          posts = await Post.find({ user: user._id }).lean();
        } else {
          // Fetch all posts if no filters are applied
          posts = await Post.find({}).lean();
        }

        // Populate post details with associated content and user data
        const populatedPosts = await Promise.all(
          posts.map(async (post) => {
            const model = modelMapping[post.postType]; // Get the model for the post type
            const content = await model.findById(post.contentId).lean(); // Fetch the content associated with the post
            const user = await User.findById(post.user).lean(); // Fetch the user who created the post
            return { ...post, content, user }; // Return the post with populated data
          })
        );

        res.status(200).json({ success: true, data: populatedPosts }); // Respond with the populated posts
      } catch (error) {
        res.status(400).json({ success: false, error: error.message }); // Handle and respond to errors
      }
      break;
    default:
      // Handle unsupported HTTP methods
      res.setHeader("Allow", ["POST"]); // Specify allowed methods
      res.status(405).end(`Method ${method} Not Allowed`); // Return 405 error for unsupported methods
      break;
  }
}
