import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Load environment variables from the .env file
dotenv.config();

// Import the database connection function

connectDB();

const port = process.env.PORT || 5000;

// Initialize the Express application
const app = express();

// A simple test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});
