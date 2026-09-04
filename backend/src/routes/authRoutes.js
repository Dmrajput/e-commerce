const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const validateRequest = require("../middleware/validateRequest");
const authMiddleware = require("../middleware/authMiddleware");
const { validateRegister, validateLogin } = require("../validators/authValidator");
const { register, login, logout, getMe } = require("../controllers/authController");

const router = express.Router();

router.post("/register", validateRequest([validateRegister]), asyncHandler(register));
router.post("/login", validateRequest([validateLogin]), asyncHandler(login));
router.post("/logout", asyncHandler(logout));
router.get("/me", authMiddleware, asyncHandler(getMe));

module.exports = router;
