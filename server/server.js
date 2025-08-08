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

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const PORT = process.env.PORT || 9000;

// core middleware
app.use(express.json({ limit: "10mb" }));
app.use(helmet());
app.use(morgan("common"));
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));

// static images (if you need them for avatars, etc.)
app.use(
  "/images",
  express.static(path.join(process.cwd(), "./public/images"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", CLIENT_ORIGIN);
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// API routes — IMPORTANT: these should mount all subrouters under /api/v1
app.use(routes);

// HTTP + Socket.IO
const server = http.createServer(app);
const io = initSocket(server, CLIENT_ORIGIN);

// make io available in controllers
app.set("io", io);

// start
(async () => {
  await dbConnect();
  server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
})();
