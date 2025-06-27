//const express = require("express");
//const app = express();
//const dotenv = require("dotenv");
//const helmet = require("helmet");
//const morgan = require("morgan");

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
app.use(cors()); // Enable CORS for all routes

app.use(routes);

dotenv.config();

app.listen(9000, () => {
  console.log("Server is running on port 9000");
  dbConnect();
});
