import express from "express";
import {
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js"; // Import both gatekeepers

const router = express.Router();

// The base route '/'
// GET is for admins to view all users
router.route("/").get(protect, admin, getUsers);

// Auth routes
router.post("/auth", authUser);
router.post("/logout", logoutUser);

// Profile routes (Just requires being logged in)
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin specific actions on individual users
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
