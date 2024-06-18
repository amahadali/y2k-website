// pages/api/wallpapers/[id].js
import dbConnect from "../../../../lib/dbConnect";
import Wallpaper from "../../../../models/Wallpaper";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const wallpaper = await Wallpaper.findById(id);
        if (!wallpaper) {
          return res
            .status(404)
            .json({ success: false, error: "Wallpaper not found" });
        }
        res.status(200).json({ success: true, data: wallpaper });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "PUT":
      try {
        const wallpaper = await Wallpaper.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!wallpaper) {
          return res
            .status(404)
            .json({ success: false, error: "Wallpaper not found" });
        }
        res.status(200).json({ success: true, data: wallpaper });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "DELETE":
      try {
        const deletedWallpaper = await Wallpaper.deleteOne({ _id: id });
        if (!deletedWallpaper) {
          return res
            .status(404)
            .json({ success: false, error: "Wallpaper not found" });
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
