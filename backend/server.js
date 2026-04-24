import express from "express";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

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
