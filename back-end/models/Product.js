const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    categories: { type: Array },
    size: { type: Array },
    color: { type: Array },
    price: { type: Number, required: true },
    in_Stock: { type: Boolean, default: true },
    inStock: { type: Number, default: 1 },
    ratings: [{
      userId: { type: String, required: true },
      rating: { type: Number, required: true }
    }],
    averageRating: {
      type: Number,
      default: 0, // To store the average rating
    },
    ratingCount: {
      type: Number,
      default: 0, // To count total ratings
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
