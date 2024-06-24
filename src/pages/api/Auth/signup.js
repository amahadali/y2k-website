// pages/api/auth/signup.js
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
        const { username, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({
          $or: [{ username }, { email }],
        });

        if (existingUser) {
          return res
            .status(400)
            .json({ success: false, message: "User already exists" });
        }

        // Create a new user
        const user = new User({ username, email, password });
        await user.save();

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
          .status(201)
          .json({ success: true, token, username: user.username });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    default:
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
