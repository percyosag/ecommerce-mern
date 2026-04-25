import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

// @desc    Auth user & get token (Login)
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find the user by their email
  const user = await User.findOne({ email });

  // Check if user exists AND if the passwords match (using our model method)
  if (user && (await user.matchPassword(password))) {
    // Generate the HTTP-Only cookie
    generateToken(res, user._id);

    // Send back the user data (without the password!)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (Requires Token)
const getUserProfile = asyncHandler(async (req, res) => {
  // We can trust req.user._id because it was verified by the authMiddleware
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  // To logout, we simply destroy the cookie by giving it an empty string and a 0 lifespan
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
};

export { authUser, logoutUser, getUserProfile };
