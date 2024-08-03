import dbConnect from "../../../../../lib/dbConnect"; // Import database connection utility
import Ringtone from "../../../../../models/Ringtone"; // Import Ringtone model for database operations

export default async function handler(req, res) {
  const { method } = req; // Extract the HTTP method from the request

  await dbConnect(); // Ensure the database connection is established

  switch (method) {
    case "POST":
      const { id } = req.body; // Extract the ringtone ID from the request body
      try {
        const ringtone = await Ringtone.findById(id); // Find the ringtone by its ID in the database
        if (!ringtone) {
          return res
            .status(404)
            .json({ success: false, message: "Ringtone not found" }); // Return 404 error if ringtone is not found
        }
        res.status(200).json(ringtone); // Return the found ringtone as JSON
      } catch (error) {
        res.status(400).json({ success: false, message: error.message }); // Return 400 error with error message if something goes wrong
      }
      break;
    default:
      // Handle unsupported HTTP methods
      res.setHeader("Allow", ["POST"]); // Specify allowed HTTP methods
      res.status(405).end(`Method ${method} Not Allowed`); // Return 405 error if method is not allowed
      break;
  }
}
