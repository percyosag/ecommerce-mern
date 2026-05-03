import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import path from "path";
import cors from "cors";

// Load environment variables from the .env file
dotenv.config();

// Import the database connection function

connectDB();

const port = process.env.PORT || 5000;
// Define allowed origins for CORS
const allowedOrigins = ["http://localhost:3000", process.env.FRONTEND_URL];

// Initialize the Express application
const app = express();

// CORS configuration

app.use(
  cors({
    origin: allowedOrigins.filter(Boolean),
    credentials: true,
  }),
);

// Body parser middleware (Allows us to read req.body)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware (Allows us to read req.cookies)
app.use(cookieParser());

// Mount the routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

// A simple test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID }),
);

// 4. Make the uploads folder static so the frontend can read the images
const __dirname = path.resolve(); // Resolves the current directory for ES Modules
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(notFound);
app.use(errorHandler);

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});
