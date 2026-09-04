const express = require("express");
const v1Routes = require("./v1");
const systemRoutes = require("./v1/systemRoutes");
const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const categoryRoutes = require("./categoryRoutes");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/admin", authMiddleware, adminMiddleware, adminRoutes);
router.use("/v1", v1Routes);
router.use(systemRoutes);

module.exports = router;