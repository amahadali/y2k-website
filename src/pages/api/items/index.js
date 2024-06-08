import dbConnect from "../../../../lib/dbConnect";
import Item from "../../../../models/Item";

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const items = await Item.find({});
        console.log("Fetched items from database:", items); // Add this log
        res.status(200).json({ success: true, data: items });
      } catch (error) {
        console.error("Error fetching items:", error); // Add this log
        res
          .status(400)
          .json({ success: false, message: "Error fetching items" });
      }
      break;
    case "POST":
      try {
        const item = await Item.create(req.body);
        res.status(201).json({ success: true, data: item });
      } catch (error) {
        console.error("Error creating item:", error); // Add this log
        res
          .status(400)
          .json({ success: false, message: "Error creating item" });
      }
      break;
    default:
      res.status(400).json({ success: false, message: "Invalid method" });
      break;
  }
}
