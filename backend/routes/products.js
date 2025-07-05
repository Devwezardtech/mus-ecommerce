const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { storage, cloudinary } = require("../config/cloudinary");
const upload = multer({ storage });
const Product = require("../models/Product");

const router = express.Router();

// ✅ Auth Middleware
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

// CREATE product (Cloudinary image sent from frontend)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, description, price, commission, stock, image } = req.body;

    if (!name || !description || !price || !image) {
      return res.status(400).json({ error: "All fields and image are required." });
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      commission: commission || 0.2,
      createdBy: req.user.id,
      photo: image,        // save the full image URL
      photoId: image,      // optional – same as URL or public_id
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ GET all or by seller
router.get("/", async (req, res) => {
  try {
    const { seller } = req.query;
    const query = seller ? { createdBy: seller } : {};
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

// ✅ GET single product (public)
router.get("/public/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Seller-only products
router.get("/my-products", authenticateToken, async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch seller products" });
  }
});

// ✅ UPDATE product (and image)
router.put("/:id", authenticateToken, upload.single("photo"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (req.user.role !== "admin" && product.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { name, description, price, commission, stock } = req.body;

    const updates = {
      name,
      description,
      price,
      commission,
      stock,
    };

    // ✅ Replace photo on Cloudinary if new one is uploaded
    if (req.file) {
      // Delete old photo from Cloudinary
      if (product.photoId) {
        await cloudinary.uploader.destroy(product.photoId);
      }
      updates.photo = req.file.path;
      updates.photoId = req.file.filename;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ DELETE product + Cloudinary image
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (req.user.role !== "admin" && product.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Delete Cloudinary image
    if (product.photoId) {
      await cloudinary.uploader.destroy(product.photoId);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Unshare product (affiliate)
router.put("/:id/unshare", authenticateToken, async (req, res) => {
  try {
    const { affiliateId } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.sharedBy?.toString() === affiliateId) {
      product.sharedBy = null;
      await product.save();
      return res.json({ message: "Product unshared" });
    }

    res.status(403).json({ error: "Unauthorized" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
