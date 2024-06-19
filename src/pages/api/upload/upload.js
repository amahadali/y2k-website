import dbConnect from "../../../../lib/dbConnect";
import { verifyToken } from "../../../../lib/middleware/auth";
import Game from "../../../../models/Game";
import Ringtone from "../../../../models/Ringtone";
import Song from "../../../../models/Song";
import Wallpaper from "../../../../models/Wallpaper";
import Post from "../../../../models/Posts";

export default async function handler(req, res) {
  await dbConnect();

  verifyToken(req, res, async () => {
    const { method } = req;
    const userId = req.user.id;

    if (method === "POST") {
      const { postType, title, additionalFields, fileUrl, imageFileUrl } =
        req.body;

      let contentDocument;

      switch (postType) {
        case "game":
          contentDocument = new Game({
            title,
            ...additionalFields,
            imageUrl: imageFileUrl,
            user: userId,
          });
          break;
        case "ringtone":
          contentDocument = new Ringtone({
            title,
            ...additionalFields,
            mp3Url: fileUrl,
            imageUrl: imageFileUrl,
            user: userId,
          });
          break;
        case "song":
          contentDocument = new Song({
            title,
            ...additionalFields,
            mp3Url: fileUrl,
            imageUrl: imageFileUrl,
            user: userId,
          });
          break;
        case "wallpaper":
          contentDocument = new Wallpaper({
            title,
            imageUrl: fileUrl,
            user: userId,
          });
          break;
        default:
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

      res
        .status(201)
        .json({ success: true, message: "Post created successfully" });
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  });
}
