import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import { getToken } from "next-auth/jwt";
import { s3Client, PutObjectCommand } from "../../../../lib/awsConfig";
import multer from "multer";

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to handle single file upload
const uploadMiddleware = upload.single("profileImage");

// Function to upload file to S3 and return the URL
const uploadFileToS3 = async (file) => {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ContentDisposition: "inline", // Inline for images to display directly
  });

  await s3Client.send(command);

  // Construct and return the file URL
  const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${command.input.Key}`;
  return url;
};

// Disable built-in bodyParser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// API route handler
const handler = async (req, res) => {
  // Connect to the database
  await dbConnect();

  // Authenticate the user
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.method === "POST") {
    // Handle file upload using multer middleware
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      const { username } = req.body;
      // Upload profile image if provided
      const profileImage = req.file ? await uploadFileToS3(req.file) : null;

      try {
        // Find the user by token ID
        const user = await User.findById(token.id);
        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }

        // Update user profile with new username and/or profile image
        user.username = username || user.username;
        if (profileImage) {
          user.profileImage = profileImage;
        }

        // Save the updated user document
        await user.save();

        // Respond with success and updated user data
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    });
  } else {
    // Handle unsupported HTTP methods
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
