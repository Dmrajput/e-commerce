const express = require("express");
const { sendSuccess } = require("../utils/response");

const router = express.Router();

router.get("/me", (req, res) => {
	return sendSuccess(res, {
		message: "Admin access granted",
		data: {
			user: req.user,
		},
	});
});

module.exports = router;
