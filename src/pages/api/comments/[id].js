// pages/api/comments/[id].js
import dbConnect from "../../../lib/dbConnect";
import Comment from "../../../models/Comment";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const comment = await Comment.findById(id);
        if (!comment) {
          return res
            .status(404)
            .json({ success: false, error: "Comment not found" });
        }
        res.status(200).json({ success: true, data: comment });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "PUT":
      try {
        const comment = await Comment.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!comment) {
          return res
            .status(404)
            .json({ success: false, error: "Comment not found" });
        }
        res.status(200).json({ success: true, data: comment });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "DELETE":
      try {
        const deletedComment = await Comment.deleteOne({ _id: id });
        if (!deletedComment) {
          return res
            .status(404)
            .json({ success: false, error: "Comment not found" });
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
