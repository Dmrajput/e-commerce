const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "User reference is required"],
			index: true,
		},
		name: {
			type: String,
			required: [true, "Name is required"],
			trim: true,
			maxlength: 120,
		},
		phone: {
			type: String,
			required: [true, "Phone is required"],
			trim: true,
			match: [/^\d{10,15}$/, "Phone must be 10 to 15 digits"],
		},
		address: {
			type: String,
			required: [true, "Address is required"],
			trim: true,
			maxlength: 500,
		},
		city: {
			type: String,
			required: [true, "City is required"],
			trim: true,
			maxlength: 100,
		},
		state: {
			type: String,
			required: [true, "State is required"],
			trim: true,
			maxlength: 100,
		},
		pincode: {
			type: String,
			required: [true, "Pincode is required"],
			trim: true,
			match: [/^\d{4,10}$/, "Pincode must be 4 to 10 digits"],
		},
	},
	{
		timestamps: true,
	}
);

addressSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Address", addressSchema);
