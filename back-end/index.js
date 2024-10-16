// index.js
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const cors = require("cors");
const wishlistRoute = require("./routes/wishlist");
const subscriptionRoute = require("./routes/subscription"); // Import the subscription route

mongoose
  .connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 10000 }) // 10 seconds timeout
  .then(() => console.log("DB Connection Successful!"))
  .catch((err) => {
    console.error("DB Connection Error:", err.message);
  });

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/subscription", subscriptionRoute); // Use the subscription route

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running!");
});
