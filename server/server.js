import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import routes from "./routes/routes.js";
import { dbConnect } from "./dbConnect/dbConnect.js";

import "dotenv/config";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// Standard-CORS für API-Zugriff
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Statische Bilder CORS-freundlich servieren
app.use(
  "/images",
  express.static(path.join(process.cwd(), "./public/images"), {
    setHeaders: (res, path) => {
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); // <- wichtig für <img>
    },
  })
);

// Routen
app.use(routes);

// Serverstart
app.listen(9000, () => {
  console.log("Server is running on port 9000");
  dbConnect();
});
