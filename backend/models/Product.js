const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  imageUrl: { type: String, required: true },
  description: { type: String },
  discount: { type: Number, default: 0 }, // Percentage discount
  category: { type: String, required: true }, // e.g., "Books", "Beauty", "Grocery"
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
