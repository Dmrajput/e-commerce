const express = require("express");
const systemRoutes = require("./systemRoutes");

const router = express.Router();

router.use(systemRoutes);

module.exports = router;