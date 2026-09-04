const { sendError } = require("../utils/response");

function validateRequest(validations = []) {
  return function validatorMiddleware(req, res, next) {
    const errors = [];

    validations.forEach((validate) => {
      const result = validate(req);
      if (Array.isArray(result) && result.length) {
        errors.push(...result);
      }
    });

    if (errors.length > 0) {
      return sendError(res, {
        statusCode: 422,
        message: "Validation failed",
        errors,
      });
    }

    return next();
  };
}

module.exports = validateRequest;