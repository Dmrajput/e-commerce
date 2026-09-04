const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const app = express();
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

app.use(helmet());

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ECommerce API is running",
  });
});

module.exports = app;