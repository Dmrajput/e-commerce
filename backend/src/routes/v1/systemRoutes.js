const express = require("express");
const asyncHandler = require("../../middleware/asyncHandler");
const validateRequest = require("../../middleware/validateRequest");
const { getHealth } = require("../../controllers/systemController");

const router = express.Router();

router.get("/health", validateRequest([]), asyncHandler(getHealth));

module.exports = router;