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
  registerUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js"; // Import both gatekeepers

const router = express.Router();

// Auth routes
router.post("/auth", authUser);
router.post("/logout", logoutUser);

// Profile routes (Just requires being logged in)
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// The base route '/'
// POST is for registering a user (Public)
// GET is for admins to view all users (Private/Admin)
router.route("/").post(registerUser).get(protect, admin, getUsers);

// Admin specific actions on individual users
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
