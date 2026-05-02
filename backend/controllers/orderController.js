import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { calcPrices } from "../utils/calcPrices.js";
import { createPayPalOrder, capturePayPalOrder } from "../utils/paypal.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    // SECURITY POINT: Get the ordered items directly from our database
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    // Map over the order items and force them to use the price from OUR database, not the client
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id,
      );
      if (!matchingItemFromDB) {
        res.status(404);
        throw new Error(`Product not found with ID: ${itemFromClient._id}`);
      }
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    // Calculate prices securely on the server
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/mine
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const createPayPalOrderForOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error("Order is already paid");
  }

  const paypalOrder = await createPayPalOrder(order);

  res.json({
    id: paypalOrder.id,
  });
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error("Order is already paid");
  }

  const paypalOrderId = req.body.orderID;

  if (!paypalOrderId) {
    res.status(400);
    throw new Error("PayPal order ID is missing");
  }

  const captureData = await capturePayPalOrder(paypalOrderId);

  if (captureData.status !== "COMPLETED") {
    res.status(400);
    throw new Error("PayPal payment was not completed");
  }

  const paidAmount =
    captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value;

  if (Number(paidAmount).toFixed(2) !== Number(order.totalPrice).toFixed(2)) {
    res.status(400);
    throw new Error("Paid amount does not match order total");
  }

  const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0];

  order.isPaid = true;
  order.paidAt = Date.now();

  order.paymentResult = {
    id: capture?.id || paypalOrderId,
    status: captureData.status,
    update_time: capture?.update_time,
    email_address: captureData.payer?.email_address,
  };

  const updatedOrder = await order.save();

  res.json(updatedOrder);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  createPayPalOrderForOrder,
};
