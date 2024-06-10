// pages/api/likes/[id].js
import dbConnect from "../../../lib/dbConnect";
import Like from "../../../models/Like";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const like = await Like.findById(id);
        if (!like) {
          return res
            .status(404)
            .json({ success: false, error: "Like not found" });
        }
        res.status(200).json({ success: true, data: like });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "PUT":
      try {
        const like = await Like.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!like) {
          return res
            .status(404)
            .json({ success: false, error: "Like not found" });
        }
        res.status(200).json({ success: true, data: like });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "DELETE":
      try {
        const deletedLike = await Like.deleteOne({ _id: id });
        if (!deletedLike) {
          return res
            .status(404)
            .json({ success: false, error: "Like not found" });
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
