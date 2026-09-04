const mongoose = require("mongoose");
const { sendSuccess } = require("../utils/response");

async function getHealth(req, res) {
  const stateMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  return sendSuccess(res, {
    message: "API is healthy",
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      database: {
        provider: "mongodb",
        status: stateMap[mongoose.connection.readyState] || "unknown",
      },
      version: "v1",
    },
  });
}

module.exports = {
  getHealth,
};