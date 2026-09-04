const { AppError } = require("./errorMiddleware");

function adminMiddleware(req, res, next) {
	if (!req.user) {
		return next(new AppError("Authentication required", 401));
	}

	if (req.user.role !== "admin") {
		return next(new AppError("Admin access required", 403));
	}

	return next();
}

module.exports = adminMiddleware;
