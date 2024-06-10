// pages/api/ringtones/[id].js
import dbConnect from "../../../lib/dbConnect";
import Ringtone from "../../../models/Ringtone";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const ringtone = await Ringtone.findById(id);
        if (!ringtone) {
          return res
            .status(404)
            .json({ success: false, error: "Ringtone not found" });
        }
        res.status(200).json({ success: true, data: ringtone });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "PUT":
      try {
        const ringtone = await Ringtone.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!ringtone) {
          return res
            .status(404)
            .json({ success: false, error: "Ringtone not found" });
        }
        res.status(200).json({ success: true, data: ringtone });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "DELETE":
      try {
        const deletedRingtone = await Ringtone.deleteOne({ _id: id });
        if (!deletedRingtone) {
          return res
            .status(404)
            .json({ success: false, error: "Ringtone not found" });
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
