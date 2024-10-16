// models/Subscription.js
const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate emails
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);
