import express from "express";
import {
  getProducts,
  getProductById,
} from "../controllers/productController.js";

const router = express.Router();

// Map the routes to the controller functions
router.route("/").get(getProducts);
router.route("/:id").get(getProductById);

export default router;
