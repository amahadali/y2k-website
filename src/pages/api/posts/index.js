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

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const token = await getToken({
          req,
          secret: process.env.NEXTAUTH_SECRET,
        });
        if (!token) {
          return res.status(401).json({ message: "Authentication required" });
        }

        const { username, contentId } = req.body;
        let posts;

        if (contentId) {
          // Fetch posts by contentId
          posts = await Post.find({ contentId }).lean();
          if (!posts || posts.length === 0) {
            return res
              .status(404)
              .json({ success: false, message: "Post not found" });
          }
        } else if (username) {
          // Fetch posts by username
          const user = await User.findOne({ username });
          if (!user) {
            return res
              .status(404)
              .json({ success: false, message: "User not found" });
          }
          posts = await Post.find({ user: user._id }).lean();
        } else {
          // Fetch all posts
          posts = await Post.find({}).lean();
        }

        const populatedPosts = await Promise.all(
          posts.map(async (post) => {
            const model = modelMapping[post.postType];
            const content = await model.findById(post.contentId).lean();
            return { ...post, content };
          })
        );

        res.status(200).json({ success: true, data: populatedPosts });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
