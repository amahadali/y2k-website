// pages/api/libraries/[id].js
import dbConnect from "../../../lib/dbConnect";
import Library from "../../../models/Library";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const library = await Library.findById(id);
        if (!library) {
          return res
            .status(404)
            .json({ success: false, error: "Library not found" });
        }
        res.status(200).json({ success: true, data: library });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "PUT":
      try {
        const library = await Library.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!library) {
          return res
            .status(404)
            .json({ success: false, error: "Library not found" });
        }
        res.status(200).json({ success: true, data: library });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "DELETE":
      try {
        const deletedLibrary = await Library.deleteOne({ _id: id });
        if (!deletedLibrary) {
          return res
            .status(404)
            .json({ success: false, error: "Library not found" });
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
