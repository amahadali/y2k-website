// Import necessary components from AWS SDK packages
import { S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize an S3 client with configuration options
const s3Client = new S3Client({
  // AWS region where the S3 bucket is located
  region: process.env.AWS_REGION,

  // AWS credentials for accessing the S3 service
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Export the S3 client, signed URL utility, and PutObjectCommand for use in other modules
export { s3Client, getSignedUrl, PutObjectCommand };
