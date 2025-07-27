const Order = require("../models/Order");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("products.productId", "name price")
      .populate("customerInfo", "name email address phone"); // If customerInfo is a ref
    res.json(orders);
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};
