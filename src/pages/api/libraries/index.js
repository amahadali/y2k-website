// src/pages/api/libraries/index.js
import dbConnect from "../../../../lib/dbConnect";
import Library from "../../../../models/Library";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  await dbConnect();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const userId = token.sub;

  switch (req.method) {
    case "GET":
      try {
        const libraries = await Library.find({ user: userId });
        res.status(200).json({ success: true, data: libraries });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "POST":
      try {
        const { name, description, isPrivate } = req.body;
        const newLibrary = new Library({
          name,
          description,
          isPrivate,
          user: userId,
        });
        const savedLibrary = await newLibrary.save();
        res.status(201).json({ success: true, data: savedLibrary });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
