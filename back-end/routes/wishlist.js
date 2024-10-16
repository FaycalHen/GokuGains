const Wishlist = require("../models/Wishlist");
const { verifyToken, verifyTokenAndAuthorization } = require("./verifyToken");

const router = require("express").Router();

// ADD TO WISHLIST
router.post("/", verifyToken, async (req, res) => {
  try {
    const existingWishlist = await Wishlist.findOne({ userId: req.user.id });

    if (existingWishlist) {
      // Check if the product already exists in the wishlist
      const productExists = existingWishlist.products.some(
        (product) => product.productId === req.body.products[0].productId
      );

      if (!productExists) {
        existingWishlist.products.push(req.body.products[0]);
        const updatedWishlist = await existingWishlist.save();
        return res.status(200).json(updatedWishlist);
      } else {
        return res.status(400).json("Product is already in the wishlist");
      }
    } else {
      const newWishlist = new Wishlist({
        userId: req.user.id,
        products: req.body.products,
      });
      const savedWishlist = await newWishlist.save();
      return res.status(200).json(savedWishlist);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});


// UPDATE WISHLIST
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedWishlist = await Wishlist.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedWishlist);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE PRODUCT FROM WISHLIST
router.delete("/:userId/product/:productId", verifyToken, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.userId });
    if (wishlist) {
      const updatedProducts = wishlist.products.filter(
        (product) => product.productId !== req.params.productId
      );
      wishlist.products = updatedProducts;
      await wishlist.save();
      res.status(200).json("Product has been removed from the wishlist...");
    } else {
      res.status(404).json("Wishlist not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});



// GET USER WISHLIST
router.get("/find/:userId", verifyToken, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.userId });
    return res.status(200).json(wishlist);
  } catch (err) {
    return res.status(500).json(err);
  }
});


module.exports = router;
