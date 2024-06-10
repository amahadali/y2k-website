// pages/api/wallpapers/index.js
import dbConnect from "../../../lib/dbConnect";
import Wallpaper from "../../../models/Wallpaper";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const wallpapers = await Wallpaper.find({});
        res.status(200).json({ success: true, data: wallpapers });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "POST":
      try {
        const wallpaper = await Wallpaper.create(req.body);
        res.status(201).json({ success: true, data: wallpaper });
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
