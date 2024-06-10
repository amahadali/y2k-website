// pages/api/comments/index.js
import dbConnect from "../../../lib/dbConnect";
import Comment from "../../../models/Comment";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const comments = await Comment.find({});
        res.status(200).json({ success: true, data: comments });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "POST":
      try {
        const comment = await Comment.create(req.body);
        res.status(201).json({ success: true, data: comment });
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
