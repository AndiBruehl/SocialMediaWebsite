// server.js
import express from "express";
import http from "http";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import routes from "./routes/routes.js";
import { dbConnect } from "./dbConnect/dbConnect.js";
import { initSocket } from "./socket/index.js";

dotenv.config();

const app = express();

// --- core middleware
app.use(express.json({ limit: "10mb" }));
app.use(helmet());
app.use(morgan("common"));

// --- CORS
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

// --- static images w/ relaxed CORP for <img> tags
app.use(
  "/images",
  express.static(path.join(process.cwd(), "./public/images"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", CLIENT_ORIGIN);
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// --- API routes
app.use(routes);

// --- start HTTP + Socket.IO
const PORT = process.env.PORT || 9000;
const server = http.createServer(app);

// IMPORTANT: init socket AFTER creating http server
initSocket(server, CLIENT_ORIGIN);

// connect DB then listen
(async () => {
  await dbConnect();
  server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
})();
