import { hash } from "bcryptjs";
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

        // Hash the password before saving it to the database
        const hashedPassword = await hash(password, 10);

        // Create a new user
        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        // Respond with success message
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
