const bcrypt = require("bcrypt");
const User = require("../models/User");
const { AppError } = require("../middleware/errorMiddleware");
const { sendSuccess } = require("../utils/response");
const generateToken = require("../utils/generateToken");

function getCookieOptions() {
	const isProd = process.env.NODE_ENV === "production";
	const cookieDays = Number(process.env.JWT_COOKIE_DAYS) || 7;

	return {
		httpOnly: true,
		secure: isProd,
		sameSite: isProd ? "none" : "lax",
		maxAge: cookieDays * 24 * 60 * 60 * 1000,
		path: "/",
	};
}

function sanitizeUser(userDoc) {
	return {
		id: userDoc._id,
		name: userDoc.name,
		email: userDoc.email,
		phone: userDoc.phone,
		role: userDoc.role,
		status: userDoc.status,
		createdAt: userDoc.createdAt,
		updatedAt: userDoc.updatedAt,
	};
}

async function register(req, res) {
	const { name, email, phone, password } = req.body;

	const existingEmail = await User.findOne({ email: String(email).toLowerCase() });
	if (existingEmail) {
		throw new AppError("Email is already registered", 409, [
			{ field: "email", message: "Email already exists" },
		]);
	}

	const existingPhone = await User.findOne({ phone });
	if (existingPhone) {
		throw new AppError("Phone is already registered", 409, [
			{ field: "phone", message: "Phone already exists" },
		]);
	}

	const passwordHash = await bcrypt.hash(password, 12);

	let user;
	try {
		user = await User.create({
			name,
			email: String(email).toLowerCase(),
			phone,
			password: passwordHash,
			role: "customer",
		});
	} catch (error) {
		if (error?.code === 11000 && error?.keyPattern?.email) {
			throw new AppError("Email is already registered", 409, [
				{ field: "email", message: "Email already exists" },
			]);
		}

		if (error?.code === 11000 && error?.keyPattern?.phone) {
			throw new AppError("Phone is already registered", 409, [
				{ field: "phone", message: "Phone already exists" },
			]);
		}

		throw error;
	}

	const token = generateToken({ id: user._id, role: user.role });
	res.cookie("token", token, getCookieOptions());

	return sendSuccess(res, {
		statusCode: 201,
		message: "Registration successful",
		data: {
			user: sanitizeUser(user),
		},
	});
}

async function login(req, res) {
	const { email, password } = req.body;

	const user = await User.findOne({ email: String(email).toLowerCase() });
	if (!user) {
		throw new AppError("Invalid email or password", 401);
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		throw new AppError("Invalid email or password", 401);
	}

	if (user.status !== "active") {
		throw new AppError("Account is not active", 403);
	}

	const token = generateToken({ id: user._id, role: user.role });
	res.cookie("token", token, getCookieOptions());

	return sendSuccess(res, {
		message: "Login successful",
		data: {
			user: sanitizeUser(user),
		},
	});
}

async function logout(req, res) {
	const cookieOptions = getCookieOptions();
	res.clearCookie("token", {
		httpOnly: true,
		secure: cookieOptions.secure,
		sameSite: cookieOptions.sameSite,
		path: "/",
	});

	return sendSuccess(res, {
		message: "Logout successful",
		data: {},
	});
}

async function getMe(req, res) {
	return sendSuccess(res, {
		message: "User profile fetched",
		data: {
			user: sanitizeUser(req.user),
		},
	});
}

module.exports = {
	register,
	login,
	logout,
	getMe,
};
