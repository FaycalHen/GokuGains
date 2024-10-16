const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    fullName: { type: String }, // Added full name
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    avatar: { type: String }, // Renamed from img to avatar
    phone: { type: String }, // Added phone number
    address: { type: String }, // Added address
    birthDate: { type: Date }, // Added birth date
    jobTitle: { type: String }, // Added job title
    active: { type: Boolean, default: true }, // Add this line
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
