const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Order");
const WithdrawRequest = require("../models/WithdrawRequest");
const jwt = require("jsonwebtoken");

// Middleware to protect route
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};

// Generate affiliate refCode
router.post("/generate", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "affiliate") {
      return res.status(403).json({ error: "Only affiliates can generate links." });
    }

    if (user.refCode) return res.json({ refCode: user.refCode });

    const code = "ref" + Math.random().toString(36).substring(2, 10);
    user.refCode = code;
    await user.save();

    res.json({ refCode: code });
  } catch (err) {
    console.error("Referral code error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Save product to showcase
router.post("/showcase", authenticateToken, async (req, res) => {
  const { productId } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "affiliate") {
      return res.status(403).json({ error: "Only affiliates can save showcase." });
    }

    if (user.showcase.includes(productId)) {
      return res.status(400).json({ error: "Product already in showcase." });
    }

    user.showcase.push(productId);
    await user.save();
    res.json({ message: "Added to showcase", showcase: user.showcase });
  } catch (error) {
    console.error("Add to showcase error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Get affiliate’s own showcase
router.get("/showcase", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("showcase");
    if (!user || user.role !== "affiliate") {
      return res.status(403).json({ error: "Only affiliates can view showcase." });
    }

    res.json(user.showcase);
  } catch (error) {
    console.error("Fetch showcase error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete from showcase
router.delete("/showcase/:productId", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.showcase = user.showcase.filter(
      (id) => id.toString() !== req.params.productId
    );
    await user.save();
    res.json({ message: "Removed from showcase" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove showcase item" });
  }
});

// Get affiliate profile (refCode)
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("refCode role");
    if (!user || user.role !== "affiliate") {
      return res.status(403).json({ error: "Access denied" });
    }
    res.json({ refCode: user.refCode });
  } catch (err) {
    console.error("Profile fetch error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET referred orders for affiliate (used by AffiliateOrders.jsx)
router.get("/orders", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "affiliate") {
      return res.status(403).json({ error: "Access denied" });
    }

    const orders = await Order.find({ referralBy: user.refCode })
      .populate("userId", "email")
      .populate("products.productId", "name price commission photo")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Affiliate orders error:", err);
    res.status(500).json({ error: "Failed to fetch affiliate orders" });
  }
});

// GET all showcase products (public affiliate page)
router.get("/showcase/all", async (req, res) => {
  try {
    const users = await User.find({ role: "affiliate" }).populate("showcase");
    const allProducts = users.flatMap((user) => user.showcase);
    res.json(allProducts);
  } catch (err) {
    res.status(500).json({ error: "Failed to load affiliate showcase" });
  }
});


// Withdrawable commission route
router.get("/withdrawable", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "affiliate") return res.status(403).json({ error: "Access denied" });

    const orders = await Order.find({
  referralBy: user.refCode,
  status: { $regex: /^delivered$/i }
})
      .populate("products.productId", "price commission");

    let withdrawable = 0;
    orders.forEach(order => {
      order.products.forEach(item => {
        const { price, commission } = item.productId;
        withdrawable += price * commission * item.quantity;
      });
    });

    res.json({ amount: withdrawable.toFixed(2) });
  } catch (err) {
    console.error("Withdrawable fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Withdraw request
router.post("/withdraw", authenticateToken, async (req, res) => {
  const { bankName, accountNumber, accountName } = req.body;

  if (!bankName || !accountNumber || !accountName) {
    return res.status(400).json({ error: "Bank details are required" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "affiliate") return res.status(403).json({ error: "Access denied" });

    const orders = await Order.find({ referralBy: user.refCode, status: "Delivered" })
      .populate("products.productId", "price commission");

    let total = 0;
    orders.forEach(order => {
      order.products.forEach(item => {
        const { price, commission } = item.productId;
        total += price * commission * item.quantity;
      });
    });

    if (total <= 0) {
      return res.status(400).json({ error: "No eligible commission to withdraw" });
    }

    const request = new WithdrawRequest({
      affiliate: user._id,
      amount: total,
      bankName,
      accountNumber,
      accountName,
      status: "Pending"
    });

    await request.save();

    res.json({ message: `Withdrawal of ₱${total.toFixed(2)} recorded. Admin will be notified.` });
  } catch (err) {
    console.error("Withdraw request failed:", err);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
