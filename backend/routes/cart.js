const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Cart = require("../models/Cart");


// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message); // <== ADD THIS
    res.status(403).json({ error: "Invalid token" });
  }
};


// GET /api/cart - Get all items from user's cart
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user's cart and populate product details
    const cart = await Cart.findOne({ userId }).populate("items.productId", "name price photo");

    if (!cart) return res.json([]); // No cart yet

    res.json(cart.items); // return only the items array
  } catch (err) {
    console.error("Error fetching cart:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/cart - Add item to user's cart
router.post("/", authenticateToken, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    // Check if user already has a cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // No cart yet → create new
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      // Cart exists → check if product is already in cart
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity; // increment
      } else {
        cart.items.push({ productId, quantity }); // add new
      }
    }

    await cart.save();
    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    console.error("Add to cart error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

//quantity and remove item from cart
// Increment quantity
router.put("/increment/:productId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) return res.status(404).json({ error: "Item not found in cart" });

    item.quantity += 1;
    await cart.save();
    res.json({ message: "Quantity increased" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Decrement quantity
router.put("/decrement/:productId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) return res.status(404).json({ error: "Item not found in cart" });

    if (item.quantity <= 1) {
      return res.status(400).json({ error: "Minimum quantity is 1" });
    }

    item.quantity -= 1;
    await cart.save();
    res.json({ message: "Quantity decreased" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove from cart
router.delete("/:productId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
