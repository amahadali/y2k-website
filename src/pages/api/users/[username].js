// src/pages/api/users/[username].js
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  const { method } = req;
  const { username } = req.query;

  await dbConnect();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    console.error("Authentication required");
    return res.status(401).json({ message: "Authentication required" });
  }

  switch (method) {
    case "GET":
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return res
            .status(404)
            .json({ success: false, error: "User not found" });
        }
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
