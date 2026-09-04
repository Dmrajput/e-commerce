const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const validateRequest = require("../middleware/validateRequest");
const optionalAuth = require("../middleware/optionalAuth");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { isObjectId } = require("../validators/commonValidator");
const { validateCategoryCreate, validateCategoryUpdate } = require("../validators/categoryValidator");
const {
	listCategories,
	getCategoryById,
	createCategory,
	updateCategory,
	deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.get("/", optionalAuth, asyncHandler(listCategories));
router.get("/:id", optionalAuth, validateRequest([isObjectId("id")]), asyncHandler(getCategoryById));

router.post(
	"/",
	authMiddleware,
	adminMiddleware,
	validateRequest([validateCategoryCreate]),
	asyncHandler(createCategory)
);

router.put(
	"/:id",
	authMiddleware,
	adminMiddleware,
	validateRequest([isObjectId("id"), validateCategoryUpdate]),
	asyncHandler(updateCategory)
);

router.delete(
	"/:id",
	authMiddleware,
	adminMiddleware,
	validateRequest([isObjectId("id")]),
	asyncHandler(deleteCategory)
);

module.exports = router;
