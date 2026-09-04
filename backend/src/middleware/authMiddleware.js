const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("./asyncHandler");
const { AppError } = require("./errorMiddleware");

const authMiddleware = asyncHandler(async (req, res, next) => {
	const bearerToken = req.headers.authorization?.startsWith("Bearer ")
		? req.headers.authorization.split(" ")[1]
		: null;

	const token = req.cookies?.token || bearerToken;

	if (!token) {
		throw new AppError("Authentication required", 401);
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id).select("-password");

		if (!user) {
			throw new AppError("User not found", 401);
		}

		if (user.status !== "active") {
			throw new AppError("Account is not active", 403);
		}

		req.user = user;
		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			throw new AppError("Token expired", 401);
		}

		if (error.name === "JsonWebTokenError") {
			throw new AppError("Invalid token", 401);
		}

		throw error;
	}
});

module.exports = authMiddleware;
