// pages/api/posts/index.js
import dbConnect from "../../../../lib/dbConnect";
import Post from "../../../../models/Posts"; // Ensure the casing matches the file name

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const posts = await Post.find({});
        res.status(200).json({ success: true, data: posts });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "POST":
      try {
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
