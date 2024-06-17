// pages/api/homepage/homepage.js
import { verifyToken } from "../../../../lib/middleware/auth";

const handler = (req, res) => {
  res.status(200).json({ message: "Welcome to the HomePage!", user: req.user });
};

export default (req, res) => verifyToken(req, res, () => handler(req, res));
