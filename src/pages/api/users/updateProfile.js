// src/pages/api/users/updateProfile.js
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import { getToken } from "next-auth/jwt";
import { s3Client, PutObjectCommand } from "../../../../lib/awsConfig";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadMiddleware = upload.single("profileImage");

const uploadFileToS3 = async (file) => {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ContentDisposition: "inline",
  });

  await s3Client.send(command);

  const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${command.input.Key}`;
  return url;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  await dbConnect();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.method === "POST") {
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      const { username } = req.body;
      const profileImage = req.file ? await uploadFileToS3(req.file) : null;

      try {
        const user = await User.findById(token.id);
        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }

        user.username = username || user.username;
        if (profileImage) {
          user.profileImage = profileImage;
        }

        await user.save();

        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
