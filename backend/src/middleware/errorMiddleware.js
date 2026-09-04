const { sendError } = require("../utils/response");

class AppError extends Error {
	constructor(message, statusCode = 500, errors = []) {
		super(message);
		this.statusCode = statusCode;
		this.errors = errors;
	}
}

function notFound(req, res, next) {
	next(new AppError(`Route not found: ${req.originalUrl}`, 404));
}

function errorHandler(err, req, res, next) {
	const statusCode = err.statusCode || 500;
	const errors = Array.isArray(err.errors) ? err.errors : [];

	if (process.env.NODE_ENV !== "production" && err.stack) {
		errors.push({ stack: err.stack });
	}

	return sendError(res, {
		statusCode,
		message: err.message || "Internal Server Error",
		errors,
	});
}

module.exports = {
	AppError,
	notFound,
	errorHandler,
};
