import dbConnect from "../../../../../lib/dbConnect"; // Import the database connection utility
import Game from "../../../../../models/Game"; // Import the Game model for database operations

export default async function handler(req, res) {
  const { method } = req; // Extract the HTTP method from the request

  await dbConnect(); // Ensure the database connection is established

  switch (method) {
    case "POST":
      const { id } = req.body; // Extract the game ID from the request body
      try {
        const game = await Game.findById(id); // Find the game by ID in the database
        if (!game) {
          return res
            .status(404)
            .json({ success: false, message: "Game not found" }); // Return error if game is not found
        }
        res.status(200).json(game); // Return the found game as JSON
      } catch (error) {
        res.status(400).json({ success: false, message: error.message }); // Return error message if something goes wrong
      }
      break;
    default:
      // Handle unsupported HTTP methods
      res.setHeader("Allow", ["POST"]); // Specify allowed methods
      res.status(405).end(`Method ${method} Not Allowed`); // Return method not allowed error
      break;
  }
}
