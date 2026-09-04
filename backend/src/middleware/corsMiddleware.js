const cors = require("cors");

function buildAllowedOrigins() {
  const fromList = (process.env.CLIENT_URLS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const defaults = [
    process.env.CLIENT_URL || "http://localhost:5173",
    "http://127.0.0.1:5173",
  ];

  return [...new Set([...defaults, ...fromList])];
}

const corsMiddleware = cors({
  credentials: true,
  origin(origin, callback) {
    const allowedOrigins = buildAllowedOrigins();

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
});

module.exports = corsMiddleware;