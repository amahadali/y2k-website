// pages/api/games/[id].js
import dbConnect from "../../../lib/dbConnect";
import Game from "../../../models/Game";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const game = await Game.findById(id);
        if (!game) {
          return res
            .status(404)
            .json({ success: false, error: "Game not found" });
        }
        res.status(200).json({ success: true, data: game });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "PUT":
      try {
        const game = await Game.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!game) {
          return res
            .status(404)
            .json({ success: false, error: "Game not found" });
        }
        res.status(200).json({ success: true, data: game });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "DELETE":
      try {
        const deletedGame = await Game.deleteOne({ _id: id });
        if (!deletedGame) {
          return res
            .status(404)
            .json({ success: false, error: "Game not found" });
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
