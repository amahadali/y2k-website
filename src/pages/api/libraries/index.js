// pages/api/libraries/index.js
import dbConnect from "../../../lib/dbConnect";
import Library from "../../../models/Library";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const libraries = await Library.find({});
        res.status(200).json({ success: true, data: libraries });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "POST":
      try {
        const library = await Library.create(req.body);
        res.status(201).json({ success: true, data: library });
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
