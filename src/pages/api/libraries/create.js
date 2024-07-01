// src/pages/api/libraries/create.js
import dbConnect from "../../../../lib/dbConnect";
import Library from "../../../../models/Library";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  await dbConnect();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    console.error("Authentication required");
    return res.status(401).json({ message: "Authentication required" });
  }

  const userId = token.sub;

  if (req.method === "POST") {
    try {
      const { name, description, isPrivate } = req.body;

      const newLibrary = new Library({
        name,
        description,
        isPrivate,
        user: userId,
      });

      const savedLibrary = await newLibrary.save();
      console.log("Library created successfully:", savedLibrary);

      res
        .status(201)
        .json({
          success: true,
          message: "Library created successfully",
          data: savedLibrary,
        });
    } catch (error) {
      console.error("Error creating library:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
