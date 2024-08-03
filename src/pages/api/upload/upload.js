import multer from "multer"; // Import multer for handling file uploads
import dbConnect from "../../../../lib/dbConnect"; // Import database connection utility
import {
  s3Client,
  getSignedUrl,
  PutObjectCommand,
} from "../../../../lib/awsConfig"; // Import S3 client and utilities
import { getToken } from "next-auth/jwt"; // Import token utility for NextAuth
import Game from "../../../../models/Game"; // Import Game model
import Ringtone from "../../../../models/Ringtone"; // Import Ringtone model
import Song from "../../../../models/Song"; // Import Song model
import Wallpaper from "../../../../models/Wallpaper"; // Import Wallpaper model
import Post from "../../../../models/Posts"; // Import Post model

// Configure multer to use memory storage for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to handle file uploads with multer
const uploadMiddleware = upload.fields([
  { name: "file", maxCount: 1 }, // Field for the main file (e.g., mp3 for song/ringtone)
  { name: "imageFile", maxCount: 1 }, // Field for the image file
]);

// Disable default body parsing for this API route to handle multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Function to upload a file to S3
const uploadFileToS3 = async (file, isImage) => {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME, // S3 bucket name
      Key: `${Date.now()}_${file.originalname}`, // Unique key for the file in S3
      Body: file.buffer, // File buffer
      ContentType: file.mimetype, // File MIME type
      ContentDisposition: isImage ? "inline" : "attachment", // Set content disposition based on file type
    });

    await s3Client.send(command); // Send the command to S3

    // Generate the file URL
    const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${command.input.Key}`;
    return url;
  } catch (error) {
    console.error("Error uploading to S3:", error); // Log any upload errors
    throw error; // Rethrow the error to be caught by the handler
  }
};

export default async function handler(req, res) {
  await dbConnect(); // Connect to the database

  // Retrieve the authentication token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    console.error("Authentication required"); // Log missing authentication token
    return res.status(401).json({ message: "Authentication required" });
  }

  const userId = token.sub; // Extract user ID from token

  if (req.method === "POST") {
    // Handle file upload
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err); // Log multer errors
        return res.status(500).json({ success: false, message: err.message });
      }

      try {
        // Extract fields from request body
        const { postType, title, artistName, developerName } = req.body;
        const file = req.files?.file ? req.files.file[0] : null;
        const imageFile = req.files?.imageFile ? req.files.imageFile[0] : null;

        // Validate required files for certain post types
        if ((postType === "song" || postType === "ringtone") && !file) {
          console.error("File is required for song and ringtone"); // Log missing file error
          return res.status(400).json({
            success: false,
            message: "File is required for song and ringtone",
          });
        }

        if (!imageFile) {
          console.error("Image file is required"); // Log missing image file error
          return res
            .status(400)
            .json({ success: false, message: "Image file is required" });
        }

        // Upload files to S3 and get their URLs
        const fileUrl = file ? await uploadFileToS3(file, false) : null;
        const imageFileUrl = await uploadFileToS3(imageFile, true);

        let contentDocument;

        // Create content document based on post type
        switch (postType) {
          case "game":
            contentDocument = new Game({
              title,
              developerName,
              imageUrl: imageFileUrl,
              user: userId,
            });
            break;
          case "ringtone":
            contentDocument = new Ringtone({
              title,
              mp3Url: fileUrl,
              imageUrl: imageFileUrl,
              user: userId,
            });
            break;
          case "song":
            contentDocument = new Song({
              title,
              artistName,
              mp3Url: fileUrl,
              imageUrl: imageFileUrl,
              user: userId,
            });
            break;
          case "wallpaper":
            contentDocument = new Wallpaper({
              title,
              imageUrl: imageFileUrl,
              user: userId,
            });
            break;
          default:
            console.error("Invalid post type"); // Log invalid post type error
            return res
              .status(400)
              .json({ success: false, message: "Invalid post type" });
        }

        // Save the content document and create a new post
        const savedContent = await contentDocument.save();
        const newPost = new Post({
          title,
          imageUrl: imageFileUrl,
          postType,
          contentId: savedContent._id,
          user: userId,
        });

        await newPost.save();
        console.log("Post created successfully"); // Log successful creation
        res
          .status(201)
          .json({ success: true, message: "Post created successfully" });
      } catch (error) {
        console.error("Error saving post:", error); // Log error saving post
        res.status(500).json({ success: false, message: error.message });
      }
    });
  } else {
    // Handle unsupported HTTP methods
    res.setHeader("Allow", ["POST"]); // Specify allowed methods
    res.status(405).end(`Method ${req.method} Not Allowed`); // Return 405 error for unsupported methods
  }
}
