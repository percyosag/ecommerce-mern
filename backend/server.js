import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// Load environment variables from the .env file
dotenv.config();

// Import the database connection function

connectDB();

const port = process.env.PORT || 5000;

// Initialize the Express application
const app = express();

// Body parser middleware (Allows us to read req.body)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware (Allows us to read req.cookies)
app.use(cookieParser());

// Mount the routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// A simple test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID }),
);

app.use(notFound);
app.use(errorHandler);

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});
