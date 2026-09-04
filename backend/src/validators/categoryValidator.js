const slugify = require("../utils/slugify");

function validateCategoryCreate(req) {
  const errors = [];
  const { name, slug, image, status } = req.body || {};

  if (!name || String(name).trim().length < 2) {
    errors.push({ field: "name", message: "Category name must be at least 2 characters" });
  }

  const slugSource = slug || name;
  const normalizedSlug = slugify(slugSource);
  if (!normalizedSlug) {
    errors.push({ field: "slug", message: "Valid slug or name is required" });
  }

  if (image !== undefined && typeof image !== "string") {
    errors.push({ field: "image", message: "Image must be a string URL" });
  }

  if (status !== undefined && !["active", "inactive"].includes(status)) {
    errors.push({ field: "status", message: "Status must be active or inactive" });
  }

  return errors;
}

function validateCategoryUpdate(req) {
  const errors = [];
  const { name, slug, image, status } = req.body || {};

  if (name !== undefined && String(name).trim().length < 2) {
    errors.push({ field: "name", message: "Category name must be at least 2 characters" });
  }

  if (slug !== undefined && !slugify(slug)) {
    errors.push({ field: "slug", message: "Slug format is invalid" });
  }

  if (image !== undefined && typeof image !== "string") {
    errors.push({ field: "image", message: "Image must be a string URL" });
  }

  if (status !== undefined && !["active", "inactive"].includes(status)) {
    errors.push({ field: "status", message: "Status must be active or inactive" });
  }

  if (Object.keys(req.body || {}).length === 0) {
    errors.push({ field: "body", message: "At least one field is required for update" });
  }

  return errors;
}

module.exports = {
  validateCategoryCreate,
  validateCategoryUpdate,
};