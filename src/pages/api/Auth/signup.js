// pages/api/Auth/signup.js
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
          $or: [{ username }, { email }],
        });
        if (existingUser) {
          return res
            .status(400)
            .json({ success: false, message: "User already exists" });
        }

        // Create new user
        const newUser = new User({ username, email, password });
        await newUser.save();

        return res
          .status(201)
          .json({ success: true, message: "User created successfully" });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    default:
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
