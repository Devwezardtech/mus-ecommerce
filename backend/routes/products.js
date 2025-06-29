const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");

const router = express.Router();

// ✅ Middleware
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


// Configure multer for file uploads
// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save to uploads/ folder
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });


// DELETE /api/products/:id - Delete product and its image
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Allow only admin or owner
    if (req.user.role !== "admin" && product.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to delete this product" });
    }

    // Delete the associated image
    if (product.photo) {
      const photoPath = path.join(__dirname, "../uploads", product.photo);
      fs.unlink(photoPath, (err) => {
        if (err) {
          console.warn("Failed to delete image file:", err.message);
        } else {
          console.log("Deleted image file:", product.photo);
        }
      });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product and its image deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// PUT /api/products/:id/photo - Update only photo
router.put("/:id/photo", authenticateToken, upload.single("photo"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
if (!product) return res.status(404).json({ error: "Product not found" });

// ✅ Add this check:
if (req.user.role !== "admin" && product.createdBy.toString() !== req.user.id) {
  return res.status(403).json({ error: "Not authorized to update this photo" });
}

product.photo = req.file.filename;
await product.save();
res.json({ message: "Photo updated" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// PUT /api/products/:id - Update product (with optional photo)
router.put("/:id", authenticateToken, upload.single("photo"), async (req, res) => {
  try {
    const { name, description, price, commission, stock } = req.body;

// First: Find product
const product = await Product.findById(req.params.id);
if (!product) return res.status(404).json({ error: "Product not found" });

// Then: Check if the user owns it or is admin
if (req.user.role !== "admin" && product.createdBy.toString() !== req.user.id) {
  return res.status(403).json({ error: "Not authorized to update this product" });
}

// Proceed with update
const updateFields = {
  name,
  description,
  price,
  commission,
  stock,
};

if (req.file) {
  updateFields.photo = req.file.filename;
}

const updated = await Product.findByIdAndUpdate(
  req.params.id,
  updateFields,
  { new: true }
);
res.json(updated);

  } catch (error) {
    console.error("Update error:", error.message);
    res.status(400).json({ error: error.message });
  }
});


// Get product data (without image)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select("-photo");
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product image
router.get("/:id/photo", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.photo) {
      return res.status(404).send("No photo");
    }

    const filePath = path.join(__dirname, "../uploads", product.photo);
    return res.sendFile(filePath);
  } catch (err) {
    console.error("Error loading photo:", err.message);
    return res.status(500).send("Error loading photo");
  }
});


// GET /api/products - Get all products or filter by seller
router.get("/", async (req, res) => {
  try {
    const { seller } = req.query;

    const query = {};
    if (seller) query.createdBy = seller;

    const products = await Product.find(query); // exclude photo binary
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
});


// POST /api/products - create new product
router.post("/", authenticateToken, upload.single("photo"), async (req, res) => {
  try {
    const { name, description, price, commission, stock } = req.body;

    if (!name || !description || !price || !req.file) {
      return res.status(400).json({ error: "All fields and photo required." });
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      commission: commission || 20,
      photo: req.file.filename,
      createdBy: req.user.id,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error.message);
    res.status(500).json({ error: error.message });
  }
});


// GET /api/products/my-products - seller only sees their own
router.get("/my-products", authenticateToken, async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.user.id }).select();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch seller products" });
  }
});

// ✅ GET public product (no auth required)
router.get("/public/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select("-photo");
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/public/:id/photo", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.photo) {
      return res.status(404).send("No photo");
    }
    const filePath = path.join(__dirname, "../uploads", product.photo);
    res.sendFile(filePath);
  } catch (err) {
    res.status(500).send("Error loading photo");
  }
});

// PUT /api/products/:id/unshare - Remove affiliate's sharedBy reference
router.put("/:id/unshare", authenticateToken, async (req, res) => {
  try {
    const { affiliateId } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Check if the current affiliate is the one who shared it
    if (product.sharedBy?.toString() === affiliateId) {
      product.sharedBy = null; // Remove the link
      await product.save();
      return res.json({ message: "Product unshared successfully" });
    }

    return res.status(403).json({ error: "You are not authorized to unshare this product." });
  } catch (error) {
    console.error(" Unshare error:", error.message);
    res.status(500).json({ error: "Server error while unsharing product." });
  }
});



module.exports = router;
