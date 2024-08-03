import dbConnect from "../../../../../lib/dbConnect"; // Import utility to establish a database connection
import Wallpaper from "../../../../../models/Wallpaper"; // Import the Wallpaper model for database operations

export default async function handler(req, res) {
  const { method } = req; // Extract the HTTP method from the request

  await dbConnect(); // Ensure that the database connection is established

  switch (method) {
    case "POST":
      const { id } = req.body; // Extract the wallpaper ID from the request body
      try {
        const wallpaper = await Wallpaper.findById(id); // Query the database to find the wallpaper by ID
        if (!wallpaper) {
          return res
            .status(404)
            .json({ success: false, message: "Wallpaper not found" }); // Return 404 if the wallpaper is not found
        }
        res.status(200).json(wallpaper); // Return the found wallpaper in the response
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
