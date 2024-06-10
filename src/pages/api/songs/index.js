// pages/api/songs/index.js
import dbConnect from "../../../lib/dbConnect";
import Song from "../../../models/Song";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const songs = await Song.find({});
        res.status(200).json({ success: true, data: songs });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "POST":
      try {
        const song = await Song.create(req.body);
        res.status(201).json({ success: true, data: song });
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
