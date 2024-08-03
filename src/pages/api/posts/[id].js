import dbConnect from "../../../../lib/dbConnect"; // Import database connection utility
import Post from "../../../../models/Posts"; // Import the Post model
import Game from "../../../../models/Game"; // Import the Game model
import Ringtone from "../../../../models/Ringtone"; // Import the Ringtone model
import Song from "../../../../models/Song"; // Import the Song model
import Wallpaper from "../../../../models/Wallpaper"; // Import the Wallpaper model
import { s3Client } from "../../../../lib/awsConfig"; // Import S3 client configuration
import { DeleteObjectCommand } from "@aws-sdk/client-s3"; // Import AWS S3 delete command
import { getToken } from "next-auth/jwt"; // Import NextAuth token utility

// Map post types to their corresponding models
const modelMapping = {
  game: Game,
  song: Song,
  ringtone: Ringtone,
  wallpaper: Wallpaper,
};

// Helper function to delete a file from S3
const deleteFileFromS3 = async (fileUrl) => {
  const bucketName = process.env.S3_BUCKET_NAME; // Get bucket name from environment variables
  const fileKey = fileUrl.split(
    `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`
  )[1]; // Extract file key from URL

  if (!fileKey) {
    console.log("File does not exist in S3, skipping delete operation");
    return;
  }

  try {
    // Create and send a delete command to S3
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
  const { method } = req; // Extract the HTTP method from the request
  const { id } = req.query; // Extract the post ID from the request query

  await dbConnect(); // Ensure the database connection is established

  switch (method) {
    case "DELETE":
      try {
        const token = await getToken({
          req,
          secret: process.env.NEXTAUTH_SECRET,
        }); // Get the authentication token from the request

        if (!token) {
          return res.status(401).json({ message: "Authentication required" });
        }

        const userId = token.sub; // Get the user ID from the token

        const post = await Post.findById(id); // Find the post by ID
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

        const model = modelMapping[post.postType]; // Get the model based on post type
        if (!model) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid post type" });
        }

        const content = await model.findById(post.contentId); // Find associated content
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
      // Handle unsupported HTTP methods
      res.setHeader("Allow", ["DELETE"]); // Specify allowed methods
      res.status(405).end(`Method ${method} Not Allowed`); // Return 405 error for unsupported methods
      break;
  }
}
