import multer from "multer";
import dbConnect from "../../../../lib/dbConnect";
import { getToken } from "next-auth/jwt";
import Game from "../../../../models/Game";
import Ringtone from "../../../../models/Ringtone";
import Song from "../../../../models/Song";
import Wallpaper from "../../../../models/Wallpaper";
import Post from "../../../../models/Posts";

const upload = multer({ dest: "uploads/" });

// Middleware to handle multipart/form-data
const uploadMiddleware = upload.fields([
  { name: "file", maxCount: 1 },
  { name: "imageFile", maxCount: 1 },
]);

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to use multer
  },
};

async function handler(req, res) {
  await dbConnect();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const userId = token.sub;

  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "File upload failed", error: err });
    }

    const { postType, title, artistName, developerName } = req.body;

    // Check if the necessary files are uploaded
    const file = req.files?.file ? req.files.file[0] : null;
    const imageFile = req.files?.imageFile ? req.files.imageFile[0] : null;

    // Validate files based on post type
    if ((postType === "song" || postType === "ringtone") && !file) {
      return res.status(400).json({
        success: false,
        message: "File is required for song and ringtone",
      });
    }

    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is required" });
    }

    const fileUrl = file ? file.path : null;
    const imageFileUrl = imageFile.path;

    let contentDocument;

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
        return res
          .status(400)
          .json({ success: false, message: "Invalid post type" });
    }

    try {
      const savedContent = await contentDocument.save();
      const newPost = new Post({
        title,
        imageUrl: imageFileUrl,
        postType,
        contentId: savedContent._id,
        user: userId,
      });

      await newPost.save();
      res
        .status(201)
        .json({ success: true, message: "Post created successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
}

export default handler;
