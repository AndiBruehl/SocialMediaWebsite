// middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

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

    // Aktuelles Benutzerobjekt muss mitgegeben werden
    let baseDir = "";
    let oldFile = "";

    if (file.fieldname === "profilePicture") {
      baseDir = "public/images/profile";
      oldFile = req.currentUser?.profilePicture?.split("/").pop();
    } else if (file.fieldname === "coverPicture") {
      baseDir = "public/images/cover";
      oldFile = req.currentUser?.coverPicture?.split("/").pop();
    }

    // Alte Datei löschen (wenn vorhanden)
    if (oldFile) {
      const oldPath = path.join(baseDir, oldFile);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

export const upload = multer({ storage });
export const uploadProfilePic = multer({ storage });
export const uploadCoverPic = multer({ storage });
