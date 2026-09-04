const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

function applySecurityMiddleware(app) {
  app.use(helmet());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cookieParser());
}

module.exports = applySecurityMiddleware;