import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  // Find all products in the database
  const products = await Product.find({});
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  // Find a product by the ID passed in the URL
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    // If a valid ID is passed but no product exists, return a 404
    res.status(404);
    throw new Error("Product not found");
  }
});

export { getProducts, getProductById };
