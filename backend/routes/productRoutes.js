import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

const router = express.Router();

// Map the routes to the controller functions
router.route("/").get(getProducts);
router.route("/").post(protect, admin, createProduct);
router.route("/top").get(getTopProducts);
router.route("/:id").get(checkObjectId, getProductById);
router.route("/:id").put(protect, admin, checkObjectId, updateProduct);
router.route("/:id").delete(protect, admin, checkObjectId, deleteProduct);
router.route("/:id/reviews").post(protect, checkObjectId, createProductReview);

export default router;
