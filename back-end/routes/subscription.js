// routes/subscription.js
const express = require("express");
const router = express.Router();
const Subscription = require("../models/Subscription");

// POST: Subscribe a user to the newsletter
router.post("/", async (req, res) => {
  const { email } = req.body;

  // Check if the email is already subscribed
  const existingSubscription = await Subscription.findOne({ email });
  if (existingSubscription) {
    return res.status(400).json({ message: "Email is already subscribed." });
  }

  // Create a new subscription
  const newSubscription = new Subscription({ email });
  try {
    await newSubscription.save();
    res.status(201).json({ message: "Successfully subscribed!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to subscribe.", error });
  }
});

module.exports = router;
