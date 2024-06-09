/*// pages/api/test-db.js
import dbConnect from "../../../lib/dbConnect";

export default async function handler(req, res) {
  try {
    await dbConnect();
    res
      .status(200)
      .json({ success: true, message: "Database connected successfully" });
  } catch (error) {
    console.error("Database connection failed:", error);
    res
      .status(500)
      .json({ success: false, message: "Database connection failed" });
  }
} */
