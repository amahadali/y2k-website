// pages/api/posts/[id].js
import dbConnect from "../../../lib/dbConnect";
import Post from "../../../models/Post";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const post = await Post.findById(id);
        if (!post) {
          return res
            .status(404)
            .json({ success: false, error: "Post not found" });
        }
        res.status(200).json({ success: true, data: post });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "PUT":
      try {
        const post = await Post.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!post) {
          return res
            .status(404)
            .json({ success: false, error: "Post not found" });
        }
        res.status(200).json({ success: true, data: post });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "DELETE":
      try {
        const deletedPost = await Post.deleteOne({ _id: id });
        if (!deletedPost) {
          return res
            .status(404)
            .json({ success: false, error: "Post not found" });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
