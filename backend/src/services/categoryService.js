const Category = require("../models/Category");
const slugify = require("../utils/slugify");

async function generateUniqueCategorySlug(nameOrSlug, excludeId = null) {
  const base = slugify(nameOrSlug);
  let slug = base;
  let counter = 1;

  while (true) {
    const query = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const exists = await Category.exists(query);
    if (!exists) {
      return slug;
    }

    slug = `${base}-${counter}`;
    counter += 1;
  }
}

module.exports = {
  generateUniqueCategorySlug,
};