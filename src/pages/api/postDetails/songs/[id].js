import dbConnect from "../../../../../lib/dbConnect";
import Song from "../../../../../models/Song";

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
            .json({ success: false, message: "Song not found" });
        }
        res.status(200).json(song);
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "DELETE":
      try {
        const deletedSong = await Song.findByIdAndDelete(id);
        if (!deletedSong) {
          return res
            .status(404)
            .json({ success: false, message: "Song not found" });
        }
        res
          .status(200)
          .json({ success: true, message: "Song deleted successfully" });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
