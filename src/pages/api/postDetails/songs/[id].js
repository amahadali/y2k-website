import dbConnect from "../../../../../lib/dbConnect"; // Import utility to establish a database connection
import Song from "../../../../../models/Song"; // Import the Song model for database operations

export default async function handler(req, res) {
  const { method } = req; // Extract the HTTP method from the request

  await dbConnect(); // Ensure that the database connection is established

  switch (method) {
    case "POST":
      const { id } = req.body; // Extract the song ID from the request body
      try {
        const song = await Song.findById(id); // Query the database to find the song by ID
        if (!song) {
          return res
            .status(404)
            .json({ success: false, message: "Song not found" }); // Return 404 if the song is not found
        }
        res.status(200).json(song); // Return the found song in the response
      } catch (error) {
        res.status(400).json({ success: false, message: error.message }); // Return 400 error if something goes wrong
      }
      break;
    default:
      // Handle unsupported HTTP methods
      res.setHeader("Allow", ["POST"]); // Specify which HTTP methods are allowed
      res.status(405).end(`Method ${method} Not Allowed`); // Return 405 error if method is not allowed
      break;
  }
}
