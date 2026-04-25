import mongoose from "mongoose";
import dotenv from "dotenv";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // 1. Wipe the database clean to prevent duplicate data errors
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // 2. IMPROVEMENT: Use .create() instead of .insertMany()
    // This forces Mongoose to run our pre('save') password hashing hook!
    const createdUsers = await User.create(users);

    // 3. Extract the Admin user's Object ID
    const adminUser = createdUsers[0]._id;

    // 4. Attach the Admin ID to every sample product
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    // We can use insertMany here because products don't have pre-save hooks
    await Product.insertMany(sampleProducts);

    console.log("Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error Importing Data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error(`Error Destroying Data: ${error.message}`);
    process.exit(1);
  }
};

// Check the terminal command flag. If it's "-d", destroy data. Otherwise, import.
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
