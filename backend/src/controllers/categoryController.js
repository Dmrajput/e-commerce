const Category = require("../models/Category");
const Product = require("../models/Product");
const { AppError } = require("../middleware/errorMiddleware");
const { sendSuccess } = require("../utils/response");
const { generateUniqueCategorySlug } = require("../services/categoryService");

async function listCategories(req, res) {
	const includeAll = req.query.all === "true";
	const isAdmin = req.user?.role === "admin";

	const filter = includeAll && isAdmin ? {} : { status: "active" };
	const categories = await Category.find(filter).sort({ createdAt: -1 });

	return sendSuccess(res, {
		message: "Categories fetched",
		data: { categories },
	});
}

async function getCategoryById(req, res) {
	const { id } = req.params;
	const category = await Category.findById(id);

	if (!category) {
		throw new AppError("Category not found", 404);
	}

	const isAdmin = req.user?.role === "admin";
	if (category.status !== "active" && !isAdmin) {
		throw new AppError("Category not found", 404);
	}

	return sendSuccess(res, {
		message: "Category fetched",
		data: { category },
	});
}

async function createCategory(req, res) {
	const { name, slug, image = "", status = "active" } = req.body;
	const uniqueSlug = await generateUniqueCategorySlug(slug || name);

	const category = await Category.create({
		name: String(name).trim(),
		slug: uniqueSlug,
		image,
		status,
	});

	return sendSuccess(res, {
		statusCode: 201,
		message: "Category created",
		data: { category },
	});
}

async function updateCategory(req, res) {
	const { id } = req.params;
	const category = await Category.findById(id);

	if (!category) {
		throw new AppError("Category not found", 404);
	}

	const { name, slug, image, status } = req.body;

	if (name !== undefined) {
		category.name = String(name).trim();
	}

	if (image !== undefined) {
		category.image = image;
	}

	if (status !== undefined) {
		category.status = status;
	}

	if (slug !== undefined || name !== undefined) {
		const slugSource = slug || category.name;
		category.slug = await generateUniqueCategorySlug(slugSource, id);
	}

	await category.save();

	return sendSuccess(res, {
		message: "Category updated",
		data: { category },
	});
}

async function deleteCategory(req, res) {
	const { id } = req.params;
	const category = await Category.findById(id);

	if (!category) {
		throw new AppError("Category not found", 404);
	}

	const linkedProductsCount = await Product.countDocuments({ category: id });
	if (linkedProductsCount > 0) {
		category.status = "inactive";
		await category.save();

		return sendSuccess(res, {
			message: "Category has linked products, so it was deactivated",
			data: {
				category,
				linkedProductsCount,
			},
		});
	}

	await Category.deleteOne({ _id: id });

	return sendSuccess(res, {
		message: "Category deleted",
		data: {},
	});
}

module.exports = {
	listCategories,
	getCategoryById,
	createCategory,
	updateCategory,
	deleteCategory,
};
