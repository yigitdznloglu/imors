const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const videoRoutes = require("./routes/video");
// const uploadRoutes = require("./routes/upload");
const songRoutes = require("./routes/song");

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());

// CORS Middleware
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
// app.use("/api/upload", uploadRoutes);
app.use("/api/songs", songRoutes);

console.log("NODE_ENV:", process.env.NODE_ENV);

// Export the app for testing purposes
module.exports = app;
