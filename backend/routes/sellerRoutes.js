const express = require("express");
const Seller = require("../models/Seller");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * GET seller profile (current seller)
 */
router.get("/me", auth, async (req, res) => {
  if (req.user.role !== "seller")
    return res.status(403).json({ error: "Access denied" });

  let seller = await Seller.findOne({ user: req.user.id });

  // Auto-create seller profile on first access
  if (!seller) {
    seller = await Seller.create({ user: req.user.id });
  }

  res.json(seller);
});

/**
 * UPDATE seller profile
 */
router.put("/me", auth, async (req, res) => {
  if (req.user.role !== "seller")
    return res.status(403).json({ error: "Access denied" });

  const { bio, contact, address, avatar } = req.body;

  const seller = await Seller.findOneAndUpdate(
    { user: req.user.id },
    { bio, contact, address, avatar },
    { new: true }
  );

  res.json(seller);
});

/**
 * PUBLIC seller profile (for users)
 */
router.get("/:sellerId", async (req, res) => {
  const seller = await Seller.findById(req.params.sellerId)
    .populate("user", "name");

  if (!seller) return res.status(404).json({ error: "Seller not found" });

  res.json(seller);
});

module.exports = router;
