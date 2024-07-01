import dbConnect from "../../../../lib/dbConnect";
import Post from "../../../../models/Posts";
import User from "../../../../models/User";
import Game from "../../../../models/Game";
import Song from "../../../../models/Song";
import Ringtone from "../../../../models/Ringtone";
import Wallpaper from "../../../../models/Wallpaper";
import { getToken } from "next-auth/jwt";

const modelMapping = {
  game: Game,
  song: Song,
  ringtone: Ringtone,
  wallpaper: Wallpaper,
};

export default async function handler(req, res) {
  const { method } = req;
  const { username, contentId } = req.query;

  await dbConnect();

  switch (method) {
    case "GET":
      if (contentId) {
        // Fetch post by contentId
        try {
          const posts = await Post.find({ contentId }).lean();
          if (!posts || posts.length === 0) {
            return res
              .status(404)
              .json({ success: false, message: "Post not found" });
          }
          res.status(200).json({ success: true, data: posts });
        } catch (error) {
          res.status(400).json({ success: false, message: error.message });
        }
      } else {
        // Fetch posts by username or all posts
        try {
          const query = {};
          if (username) {
            const user = await User.findOne({ username });
            if (user) {
              query.user = user._id;
            }
          }

          const posts = await Post.find(query).lean();
          const populatedPosts = await Promise.all(
            posts.map(async (post) => {
              const model = modelMapping[post.postType];
              const content = await model.findById(post.contentId).lean();
              return { ...post, content };
            })
          );
          res.status(200).json({ success: true, data: populatedPosts });
        } catch (error) {
          console.error("Error fetching posts:", error);
          res.status(400).json({ success: false, error: error.message });
        }
      }
      break;
    case "POST":
      try {
        const token = await getToken({
          req,
          secret: process.env.NEXTAUTH_SECRET,
        });
        if (!token) {
          return res.status(401).json({ message: "Authentication required" });
        }

        const userId = token.sub;

        // Ensure the user in the request body is the authenticated user
        if (req.body.user !== userId) {
          return res
            .status(403)
            .json({ success: false, message: "Unauthorized" });
        }

        const post = await Post.create(req.body);
        res.status(201).json({ success: true, data: post });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
