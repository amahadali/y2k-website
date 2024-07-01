import dbConnect from "../../../../lib/dbConnect";
import Library from "../../../../models/Library";
import Post from "../../../../models/Posts";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  await dbConnect();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    console.error("Authentication required");
    return res.status(401).json({ message: "Authentication required" });
  }

  const userId = token.sub;
  const { id } = req.query;

  if (req.method === "PATCH") {
    try {
      const { postId } = req.body;

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

      if (!library.posts.includes(postId)) {
        library.posts.push(postId);
        await library.save();
      }

      res.status(200).json({
        success: true,
        message: "Post added to library",
        data: library,
      });
    } catch (error) {
      console.error("Error updating library:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const library = await Library.findById(id).populate({
        path: "posts",
        populate: {
          path: "contentId",
          model: Post,
        },
      });
      if (!library) {
        return res
          .status(404)
          .json({ success: false, message: "Library not found" });
      }

      res.status(200).json({ success: true, data: library.posts });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.setHeader("Allow", ["PATCH", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
