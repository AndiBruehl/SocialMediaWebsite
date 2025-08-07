import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Zielverzeichnis sicherstellen
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDir("public/images/profile");
ensureDir("public/images/cover");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "profilePicture") {
      cb(null, "public/images/profile");
    } else if (file.fieldname === "coverPicture") {
      cb(null, "public/images/cover");
    } else {
      cb(null, "public/images/other");
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });

export const uploadProfilePic = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/images/profile"),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `${uuidv4()}${ext}`;
      cb(null, uniqueName);
    },
  }),
});

export const uploadCoverPic = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/images/cover"),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `${uuidv4()}${ext}`;
      cb(null, uniqueName);
    },
  }),
});
