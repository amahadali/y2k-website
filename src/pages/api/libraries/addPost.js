// pages/api/libraries/addPost.js
import dbConnect from "../../../../lib/dbConnect";
import Library from "../../../../models/Library";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  await dbConnect();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    console.error("Authentication required");
    return res.status(401).json({ message: "Authentication required" });
  }

  const userId = token.sub;

  if (req.method === "POST") {
    try {
      const { libraryId, postId } = req.body;

      const library = await Library.findOne({ _id: libraryId, user: userId });
      if (!library) {
        return res
          .status(404)
          .json({
            success: false,
            message: "Library not found or not authorized",
          });
      }

      library.posts.push(postId);
      await library.save();

      res
        .status(200)
        .json({ success: true, message: "Post added to library successfully" });
    } catch (error) {
      console.error("Error adding post to library:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
