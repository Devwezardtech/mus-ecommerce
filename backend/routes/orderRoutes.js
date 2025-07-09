const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminonly');



router.post('/', auth, async (req, res) => {
  try {
    const { products, totalAmount, customerInfo, paymentMethod, referralBy  } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Products are required" });
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      return res.status(400).json({ message: "Complete customer info is required" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required" });
    }
    
    if (paymentMethod === "GCash") {
      return res.status(400).json({ message: "GCash orders must be created after payment" });
    }

    // Deduct stock for each product
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      product.stock -= item.quantity;
      await product.save();
    }

    // 🔍 Ensure each product has valid ObjectId and price
    const validatedProducts = products.map((item) => ({
      productId: item.productId,       //  should be ObjectId string
      quantity: item.quantity,
      price: item.price,
    }));

    const order = new Order({
      userId: req.user.id,
      products: validatedProducts,
      totalAmount,
      address: customerInfo.address,
      phone: customerInfo.phone,
      paymentMethod,
      referralBy: referralBy || null  // 
    });

    const savedOrder = await order.save();
          
     // Auto-clear all cart items of this user
    await Cart.deleteMany({ userId: req.user.id });

    res.status(201).json(savedOrder);

  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// Get orders of current logged-in user
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
     .populate("products.productId", "name price")
     .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Error getting orders' });
  }
});


// Get User's Orders
router.get('/user', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("products.productId", "name price")
      .sort({ createdAt: -1 });
    res.json(orders);
    console.log("Populated orders:", orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// GET seller-specific orders (only orders containing their products)
router.get('/seller', auth, async (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const allOrders = await Order.find()
      .populate('userId', 'email')
      .populate('products.productId', 'name createdBy photo')
      .sort({ createdAt: -1 });

    // Only include orders that contain products created by this seller
    const sellerOrders = allOrders.filter(order =>
      order.products.some(p => p.productId?.createdBy?.toString() === req.user.id)
    );

    // Optional: remove unrelated products in the response (to show only seller's own items)
    const cleanedOrders = sellerOrders.map(order => ({
      ...order.toObject(),
      products: order.products.filter(p => p.productId?.createdBy?.toString() === req.user.id)
    }));

    res.json(cleanedOrders);
  } catch (err) {
    console.error('Error fetching seller orders:', err);
    res.status(500).json({ error: 'Failed to fetch seller orders' });
  }
});



// Admin GET orders
router.get('/admin', auth, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Admin get orders failed:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update order status - only admin
// Assuming you have an auth middleware that sets req.user
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = req.body.status || order.status;
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});


// GET single order by orderId and itemId for seller (for print/PDF)
router.get('/seller/:orderId/:itemId', auth, async (req, res) => {
  try {
    const { orderId, itemId } = req.params;

    if (req.user.role !== 'seller') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const order = await Order.findById(orderId)
      .populate('userId', 'email name')
      .populate('products.productId', 'name price photo createdBy');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Find the item requested and verify it's owned by this seller
    const item = order.products.find(p =>
      p._id.toString() === itemId && p.productId?.createdBy?.toString() === req.user.id
    );

    if (!item) {
      return res.status(403).json({ message: 'Item not found or not owned by seller' });
    }

    // Return only the matching item and order info
    res.json({
      order: {
        _id: order._id,
        address: order.address,
        phone: order.phone,
        paymentMethod: order.paymentMethod,
        status: order.status,
        createdAt: order.createdAt,
        userId: order.userId,
      },
      item,
    });
  } catch (err) {
    console.error('Error fetching specific seller order:', err);
    res.status(500).json({ message: 'Failed to fetch seller order details' });
  }
});


module.exports = router;