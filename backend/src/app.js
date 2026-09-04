const express = require("express");
const corsMiddleware = require("./middleware/corsMiddleware");
const applySecurityMiddleware = require("./middleware/securityMiddleware");
const { apiLimiter } = require("./middleware/rateLimitMiddleware");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const apiRoutes = require("./routes");
const { sendSuccess } = require("./utils/response");

const app = express();
app.use(corsMiddleware);
applySecurityMiddleware(app);

app.get("/", (req, res) => {
  return sendSuccess(res, {
    message: "ECommerce API is running",
    data: {
      apiBase: "/api",
      versions: ["v1"],
    },
  });
});

app.use("/api", apiLimiter, apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;