import dbConnect from "../../../../../lib/dbConnect";
import Game from "../../../../../models/Game";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query; // id will be the contentId

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const game = await Game.findById(id);
        if (!game) {
          return res
            .status(404)
            .json({ success: false, message: "Game not found" });
        }
        res.status(200).json(game);
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
