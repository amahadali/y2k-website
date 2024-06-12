// pages/api/Auth/login.js
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

        if (!user) {
          return res
            .status(401)
            .json({ success: false, message: "Invalid credentials" });
        }

        // Check password
        if (password !== user.password) {
          return res
            .status(401)
            .json({ success: false, message: "Invalid credentials" });
        }

        // Simplified login success response
        return res
          .status(200)
          .json({
            success: true,
            token: "fake-jwt-token",
            username: user.username,
          });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    default:
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
