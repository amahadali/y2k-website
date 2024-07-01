// src/pages/api/libraries/index.js
import dbConnect from "../../../../lib/dbConnect";
import Library from "../../../../models/Library";
import User from "../../../../models/User"; // Import the User model
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  await dbConnect();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const { username } = req.query;

  switch (req.method) {
    case "GET":
      try {
        let user;
        if (username) {
          user = await User.findOne({ username });
          if (!user) {
            return res
              .status(404)
              .json({ success: false, message: "User not found" });
          }
        } else {
          user = await User.findById(token.sub);
        }

        const libraries = await Library.find({ user: user._id }).populate({
          path: "posts",
          options: { limit: 3 }, // Get the first 3 posts for thumbnails
        });

        const librariesWithThumbnails = libraries.map((library) => ({
          ...library.toObject(),
          thumbnails: library.posts.slice(0, 3).map((post) => post.imageUrl),
        }));

        res.status(200).json({ success: true, data: librariesWithThumbnails });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "POST":
      try {
        const userId = token.sub;
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
