// pages/api/songs/[id].js
import dbConnect from "../../../lib/dbConnect";
import Song from "../../../models/Song";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const song = await Song.findById(id);
        if (!song) {
          return res
            .status(404)
            .json({ success: false, error: "Song not found" });
        }
        res.status(200).json({ success: true, data: song });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "PUT":
      try {
        const song = await Song.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!song) {
          return res
            .status(404)
            .json({ success: false, error: "Song not found" });
        }
        res.status(200).json({ success: true, data: song });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "DELETE":
      try {
        const deletedSong = await Song.deleteOne({ _id: id });
        if (!deletedSong) {
          return res
            .status(404)
            .json({ success: false, error: "Song not found" });
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
