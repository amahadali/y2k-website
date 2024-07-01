import dbConnect from "../../../../lib/dbConnect";
import Post from "../../../../models/Posts";
import Game from "../../../../models/Game";
import Ringtone from "../../../../models/Ringtone";
import Song from "../../../../models/Song";
import Wallpaper from "../../../../models/Wallpaper";
import { s3Client } from "../../../../lib/awsConfig";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getToken } from "next-auth/jwt";

const modelMapping = {
  game: Game,
  song: Song,
  ringtone: Ringtone,
  wallpaper: Wallpaper,
};

const deleteFileFromS3 = async (fileUrl) => {
  const bucketName = process.env.S3_BUCKET_NAME;
  const fileKey = fileUrl.split(
    `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`
  )[1];

  if (!fileKey) {
    console.log("File does not exist in S3, skipping delete operation");
    return;
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });
    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting file from S3:", error);
  }
};

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case "DELETE":
      try {
        const token = await getToken({
          req,
          secret: process.env.NEXTAUTH_SECRET,
        });
        if (!token) {
          return res.status(401).json({ message: "Authentication required" });
        }

        const userId = token.sub;

        const post = await Post.findById(id);
        if (!post) {
          return res
            .status(404)
            .json({ success: false, message: "Post not found" });
        }

        // Ensure the user deleting the post is the same as the user who created it
        if (post.user.toString() !== userId) {
          return res
            .status(403)
            .json({ success: false, message: "Unauthorized" });
        }

        const model = modelMapping[post.postType];
        if (!model) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid post type" });
        }

        const content = await model.findById(post.contentId);
        if (content) {
          // Delete associated files from S3
          if (post.imageUrl) {
            await deleteFileFromS3(post.imageUrl);
          }
          if (content.mp3Url) {
            await deleteFileFromS3(content.mp3Url);
          }

          // Delete the content document
          await model.findByIdAndDelete(post.contentId);
        }

        // Delete the post document
        await Post.findByIdAndDelete(id);

        res
          .status(200)
          .json({ success: true, message: "Post deleted successfully" });
      } catch (error) {
        console.error("Error deleting post:", error);
        res
          .status(500)
          .json({ success: false, message: "Error deleting post" });
      }
      break;
    default:
      res.setHeader("Allow", ["DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
