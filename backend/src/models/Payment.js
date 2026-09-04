const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order reference is required"],
      index: true,
    },
    gateway: {
      type: String,
      enum: ["razorpay"],
      default: "razorpay",
      required: [true, "Gateway is required"],
      index: true,
    },
    gatewayOrderId: {
      type: String,
      required: [true, "Gateway order ID is required"],
      trim: true,
      index: true,
    },
    paymentId: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 3,
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed", "refunded"],
      default: "created",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ gatewayOrderId: 1, gateway: 1 }, { unique: true });
paymentSchema.index(
  { paymentId: 1 },
  { unique: true, partialFilterExpression: { paymentId: { $type: "string" } } }
);
paymentSchema.index({ order: 1, createdAt: -1 });

module.exports = mongoose.model("Payment", paymentSchema);