function requireField(field, label) {
  return (req) => {
    const value = req.body?.[field];
    if (value === undefined || value === null || value === "") {
      return [{ field, message: `${label || field} is required` }];
    }
    return [];
  };
}

function isObjectId(field) {
  return (req) => {
    const value = req.params?.[field] || req.body?.[field];
    const valid = /^[a-fA-F0-9]{24}$/.test(String(value || ""));
    if (!value || valid) {
      return [];
    }
    return [{ field, message: `${field} must be a valid ObjectId` }];
  };
}

module.exports = {
  requireField,
  isObjectId,
};