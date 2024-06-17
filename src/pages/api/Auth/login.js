// pages/api/Auth/login.js
import jwt from "jsonwebtoken";
import cookie from "cookie";
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const { username, password } = req.body;

        // Find user by username or email
        const user = await User.findOne({
          $or: [{ username }, { email: username }],
        });

        if (!user || password !== user.password) {
          return res
            .status(401)
            .json({ success: false, message: "Invalid credentials" });
        }

        // Generate a JWT
        const token = jwt.sign(
          { id: user._id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        // Set cookie
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development", // Make it secure in production
            maxAge: 3600, // 1 hour
            sameSite: "strict",
            path: "/",
          })
        );

        // Send response with token
        return res
          .status(200)
          .json({ success: true, token, username: user.username });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    default:
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
