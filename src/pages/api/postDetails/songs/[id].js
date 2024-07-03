import dbConnect from "../../../../../lib/dbConnect";
import Song from "../../../../../models/Song";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      const { id } = req.body; // Extract id from the request body
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
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
