// pages/api/likes/index.js
import dbConnect from "../../../lib/dbConnect";
import Like from "../../../models/Like";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const likes = await Like.find({});
        res.status(200).json({ success: true, data: likes });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "POST":
      try {
        const like = await Like.create(req.body);
        res.status(201).json({ success: true, data: like });
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
