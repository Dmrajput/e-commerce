const rateLimit = require("express-rate-limit");
const { sendError } = require("../utils/response");

const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler(req, res) {
    return sendError(res, {
      statusCode: 429,
      message: "Too many requests, please try again later",
      errors: [],
    });
  },
});

module.exports = {
  apiLimiter,
};