const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { storage, cloudinary } = require("../config/cloudinary");
const upload = multer({ storage });
const Product = require("../models/Product");

const router = express.Router();

// Auth Middleware
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
    const { name, description, price, commission, stock, category, photo, photoId } = req.body;

    if (!name || !description || !price || !category || !photo || !photoId) {
      return res.status(400).json({ error: "All fields and image are required." });
    }

     // Validate numeric fields
    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock);
    const commissionNum = parseFloat(commission) || 0.2;

    if (isNaN(priceNum) || isNaN(stockNum) || isNaN(commissionNum)) {
      return res.status(400).json({ error: "Price, stock, and commission must be numbers" });
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      commission: commission || 0.2,
      createdBy: req.user.id,
      photo,
      photoId,
      category,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET products (all or by seller/category)
router.get("/", async (req, res) => {
  try {
    const { seller, category } = req.query;
    const query = {};
    if (seller) query.createdBy = seller;
    if (category) query.category = category;

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

// GET single product
router.get("/public/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET seller products
router.get("/my-products", authenticateToken, async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch seller products" });
  }
});

// UPDATE product
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    if (product.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { name, description, price, commission, stock, photo, photoId } = req.body;
    const updates = { name, description, price, commission, stock, photo, photoId };

     if (photo && photoId) {
      // delete old Cloudinary images if new ones provided
      if (product.photoId?.length > 0) {
        for (let id of product.photoId) {
          await cloudinary.uploader.destroy(id);
        }
      }
      updates.photo = photo;
      updates.photoId = photoId;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE product
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    if (req.user.role !== "admin" && product.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // delete all images from Cloudinary
    if (product.photoId?.length > 0) {
      for (let id of product.photoId) {
        await cloudinary.uploader.destroy(id);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET distinct categories
router.get("/categories", async (req, res) => {
  try {
    const categories = [
      { _id: "fashion", name: "Fashion" },
      { _id: "beauty-care", name: "Beauty & Care" },
      { _id: "Jewelry", name: "Jewelry" },
      { _id: "electronics", name: "Electronics" },
      { _id: "home-kitchen", name: "Home & Kitchen" },
      { _id: "sports-outdoors", name: "Sports & Outdoors" }
    ];
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});


module.exports = router;
