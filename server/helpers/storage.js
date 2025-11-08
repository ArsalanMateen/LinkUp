import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_PUBLIC_URL
} = process.env;

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export const uploadToR2 = async (filePath, contentType, prefix) => {
  const buffer = fs.readFileSync(filePath);
  const extension = contentType.split("/")[1] || "jpeg";
  const uniqueId = crypto.randomBytes(8).toString("hex");
  const key = `${prefix}-${Date.now()}-${uniqueId}.${extension}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  const url = `${R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
  return { url, key };
};

export const deleteFromR2 = async (key) => {
  if (!key) return;
  await s3.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    })
  );
};
