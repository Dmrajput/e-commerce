const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10,15}$/;

function validateRegister(req) {
	const errors = [];
	const { name, email, phone, password } = req.body || {};

	if (!name || String(name).trim().length < 2) {
		errors.push({ field: "name", message: "Name must be at least 2 characters" });
	}

	if (!email || !EMAIL_REGEX.test(String(email).trim())) {
		errors.push({ field: "email", message: "Valid email is required" });
	}

	if (!phone || !PHONE_REGEX.test(String(phone).trim())) {
		errors.push({ field: "phone", message: "Phone must be 10 to 15 digits" });
	}

	if (!password || String(password).length < 6) {
		errors.push({ field: "password", message: "Password must be at least 6 characters" });
	}

	return errors;
}

function validateLogin(req) {
	const errors = [];
	const { email, password } = req.body || {};

	if (!email || !EMAIL_REGEX.test(String(email).trim())) {
		errors.push({ field: "email", message: "Valid email is required" });
	}

	if (!password || String(password).length < 6) {
		errors.push({ field: "password", message: "Password must be at least 6 characters" });
	}

	return errors;
}

module.exports = {
	validateRegister,
	validateLogin,
};
