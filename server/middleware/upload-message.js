// middleware/upload-message.js
import multer from "multer";
export const uploadMessageImage = multer({
  storage: multer.memoryStorage(),
}).array("images", 5);
