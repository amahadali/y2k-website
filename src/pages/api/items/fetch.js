// pages/api/items/fetch.js
import dbConnect from "../../../../lib/dbConnect";
import Item from "../../../../models/Item";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const items = await Item.find({});
      res.status(200).json({ success: true, data: items });
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(400).json({ success: false, message: "Error fetching items" });
    }
  } else {
    res.status(400).json({ success: false, message: "Invalid method" });
  }
}
