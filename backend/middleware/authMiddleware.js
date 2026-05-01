import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

// Gatekeeper 1: User must be authenticated
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read the JWT from the 'jwt' cookie we created during login
  token = req.cookies.jwt;

  if (token) {
    try {
      // Decode the token using our secret key to get the userId
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from the DB and attach it to the request object.
      // NOTE: .select('-password') ensures we NEVER attach the password hash to the request.
      req.user = await User.findById(decoded.userId).select("-password");

      next(); // Pass the request to the next piece of middleware or the controller
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Gatekeeper 2: User must be an admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
};

export { protect, admin };
