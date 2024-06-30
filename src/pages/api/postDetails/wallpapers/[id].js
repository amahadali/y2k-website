import dbConnect from "../../../../../lib/dbConnect";
import Wallpaper from "../../../../../models/Wallpaper";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query; // id will be the contentId

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const wallpaper = await Wallpaper.findById(id);
        if (!wallpaper) {
          return res
            .status(404)
            .json({ success: false, message: "Wallpaper not found" });
        }
        res.status(200).json(wallpaper);
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
