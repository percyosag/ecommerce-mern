import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  // Create the token containing the user's ID
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Set JWT as an HTTP-Only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Uses secure HTTPS in production
    sameSite: "strict", // Prevents Cross-Site Request Forgery (CSRF) attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  });
};

export default generateToken;
