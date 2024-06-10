// pages/api/games/index.js
import dbConnect from "../../../lib/dbConnect";
import Game from "../../../models/Game";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const games = await Game.find({});
        res.status(200).json({ success: true, data: games });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "POST":
      try {
        const game = await Game.create(req.body);
        res.status(201).json({ success: true, data: game });
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
