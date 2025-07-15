import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import routes from "./routes/routes.js";

import { dbConnect } from "./dbConnect/dbConnect.js";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(routes);

dotenv.config();

app.listen(9000, () => {
  console.log("Server is running on port 9000");
  dbConnect();
});
