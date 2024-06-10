// pages/api/ringtones/index.js
import dbConnect from "../../../lib/dbConnect";
import Ringtone from "../../../models/Ringtone";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const ringtones = await Ringtone.find({});
        res.status(200).json({ success: true, data: ringtones });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "POST":
      try {
        const ringtone = await Ringtone.create(req.body);
        res.status(201).json({ success: true, data: ringtone });
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
