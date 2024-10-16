const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  console.log('Update request received with body:', req.body); // Add this line to debug
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
    console.log("updated")
  } catch (err) {
    console.error('Update failed:', err); // Add this line to log the error
    res.status(500).json(err);
  }
});


//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json("Product not found");
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET SUGGESTED PRODUCTS BY CATEGORY
router.get("/:id/suggested", async (req, res) => {
  try {
    // Find the product by ID to get its categories
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json("Product not found");
    }

    // Find other products in the same categories, excluding the current product
    const suggestedProducts = await Product.find({
      categories: { $in: product.categories },
      _id: { $ne: product._id } // Exclude the current product
    }); // You can limit the number of suggestions

    res.status(200).json(suggestedProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});
//GET PRODUCT BY TITLE
router.get("/find", async (req, res) => {
  const title = req.query.title;

  try {
    // Use a case-insensitive search for the title
    const product = await Product.findOne({ title: { $regex: title, $options: "i" } });

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json("Product not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// ADD RATING
router.post("/:id/rate", verifyToken, async (req, res) => {
  const { rating } = req.body; // Expecting rating in the request body

  try {
    // Find the product by ID
    const product = await Product.findById(req.params.id);

    // Check if the product exists
    if (!product) {
      return res.status(404).json("Product not found");
    }

    // Add the new rating to the ratings array
    product.ratings.push(rating);

    // Recalculate the average rating
    const totalRatings = product.ratings.length;
    const sumRatings = product.ratings.reduce((sum, r) => sum + r, 0);
    product.rating = sumRatings / totalRatings; // Calculate new average rating

    // Save the updated product
    await product.save();
    res.status(200).json("Rating submitted successfully");
  } catch (err) {
    console.error("Error while submitting rating:", err);
    res.status(500).json("Error while submitting rating");
  }
});

// Route to handle rating updates
router.put("/:id/rate", async (req, res) => {
  const { rating, userId } = req.body;

  try {
      const product = await Product.findById(req.params.id);
      const existingRatingIndex = product.ratings.findIndex(r => r.userId === userId);

      if (existingRatingIndex !== -1) {
          // Update existing rating
          product.ratings[existingRatingIndex].rating = rating;
      } else {
          // Add new rating
          product.ratings.push({ userId, rating });
      }

      // Calculate average rating and count
      product.ratingCount = product.ratings.length;
      product.averageRating = product.ratings.reduce((sum, r) => sum + r.rating, 0) / product.ratingCount;

      await product.save();
      res.status(200).json(product);
  } catch (err) {
      res.status(500).json(err);
  }
});





module.exports = router;