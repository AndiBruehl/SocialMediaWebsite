// utils/cloudinary-upload.js
import { v2 as cloudinary } from "cloudinary";

export const uploadBufferToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
