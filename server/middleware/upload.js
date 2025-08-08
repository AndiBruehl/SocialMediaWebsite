// utils/upload.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// import cloudinary from "../dbConnect/cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Lädt eine Datei zu Cloudinary hoch.
 * @param {string} filePath - Lokaler Pfad zur Datei (z. B. von Multer oder temporärem Speicher)
 * @param {string} folder - Zielordner in Cloudinary (z. B. "profile_pics", "cover_pics", "post_images")
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
export const uploadToCloudinary = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "image",
    });
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (err) {
    console.error("❌ Fehler beim Cloudinary-Upload:", err);
    throw err;
  }
};

/**
 * Löscht ein Bild aus Cloudinary.
 * @param {string} publicId - Die public_id des Bildes in Cloudinary
 * @returns {Promise}
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("❌ Fehler beim Löschen aus Cloudinary:", err);
    throw err;
  }
};
