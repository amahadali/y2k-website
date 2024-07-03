import dbConnect from "../../../../../lib/dbConnect";
import Game from "../../../../../models/Game";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      const { id } = req.body; // Extract id from the request body
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
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
