import multer from "multer";
import dbConnect from "../../../../lib/dbConnect";
import {
  s3Client,
  getSignedUrl,
  PutObjectCommand,
} from "../../../../lib/awsConfig";
import { getToken } from "next-auth/jwt";
import Game from "../../../../models/Game";
import Ringtone from "../../../../models/Ringtone";
import Song from "../../../../models/Song";
import Wallpaper from "../../../../models/Wallpaper";
import Post from "../../../../models/Posts";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadMiddleware = upload.fields([
  { name: "file", maxCount: 1 },
  { name: "imageFile", maxCount: 1 },
]);

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadFileToS3 = async (file, isImage) => {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${Date.now()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentDisposition: isImage ? "inline" : "attachment",
    });

    await s3Client.send(command);

    const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${command.input.Key}`;
    return url;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
};

export default async function handler(req, res) {
  await dbConnect();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    console.error("Authentication required");
    return res.status(401).json({ message: "Authentication required" });
  }

  const userId = token.sub;

  if (req.method === "POST") {
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(500).json({ success: false, message: err.message });
      }

      try {
        const { postType, title, artistName, developerName } = req.body;
        const file = req.files?.file ? req.files.file[0] : null;
        const imageFile = req.files?.imageFile ? req.files.imageFile[0] : null;

        if ((postType === "song" || postType === "ringtone") && !file) {
          console.error("File is required for song and ringtone");
          return res.status(400).json({
            success: false,
            message: "File is required for song and ringtone",
          });
        }

        if (!imageFile) {
          console.error("Image file is required");
          return res
            .status(400)
            .json({ success: false, message: "Image file is required" });
        }

        const fileUrl = file ? await uploadFileToS3(file, false) : null;
        const imageFileUrl = await uploadFileToS3(imageFile, true);

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
            console.error("Invalid post type");
            return res
              .status(400)
              .json({ success: false, message: "Invalid post type" });
        }

        const savedContent = await contentDocument.save();
        const newPost = new Post({
          title,
          imageUrl: imageFileUrl,
          postType,
          contentId: savedContent._id,
          user: userId,
        });

        await newPost.save();
        console.log("Post created successfully");
        res
          .status(201)
          .json({ success: true, message: "Post created successfully" });
      } catch (error) {
        console.error("Error saving post:", error);
        res.status(500).json({ success: false, message: error.message });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
