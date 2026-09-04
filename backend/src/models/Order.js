const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
    },
    productName: {
      type: String,
      required: [true, "Product name snapshot is required"],
      trim: true,
      maxlength: 160,
    },
    price: {
      type: Number,
      required: [true, "Price snapshot is required"],
      min: 0,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: 1,
    },
  },
  {
    _id: false,
  }
);

const shippingSnapshotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Shipping name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Shipping phone is required"],
      trim: true,
      match: [/^\d{10,15}$/, "Phone must be 10 to 15 digits"],
    },
    address: {
      type: String,
      required: [true, "Shipping address is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "Shipping city is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "Shipping state is required"],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, "Shipping pincode is required"],
      trim: true,
      match: [/^\d{4,10}$/, "Pincode must be 4 to 10 digits"],
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "Order items are required",
      },
    },
    shippingAddress: {
      type: shippingSnapshotSchema,
      required: [true, "Shipping address snapshot is required"],
    },
    subtotal: {
      type: Number,
      required: [true, "Subtotal is required"],
      min: 0,
    },
    shippingCharge: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre("validate", function populateOrderNumber(next) {
  if (!this.orderNumber) {
    const stamp = Date.now().toString().slice(-8);
    const random = Math.floor(1000 + Math.random() * 9000);
    this.orderNumber = `ORD-${stamp}${random}`;
  }
  next();
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);