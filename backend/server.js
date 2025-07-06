require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const paymentRoutes = require("./routes/paymentRoutes");
const affiliateRoutes = require("./routes/affiliate");
const stripeRoutes = require('./routes/stripe');

const app = express();

// Allow frontend Render domain
app.use(cors({
  origin: ["https://mus-ecommerce-shop.onrender.com"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/affiliate", affiliateRoutes);
app.use("/api/stripe", stripeRoutes);

// Serve static files from frontend
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// List of client-side routes (copy from App.jsx)
const allowedRoutes = [
  '/',
  '/login',
  '/signup',
  '/checkout',
  '/orders',
  '/cart',
  '/admin',
  '/admin/orders',
  '/user',
  '/user/orders',
  '/affiliate',
  '/affiliate/orders',
  '/affiliate/showcase',
  '/affiliate/withdraw',
  '/affiliateproduct',
  '/seller',
  '/seller/orders',
  '/seller/profile',
  '/profile',
  '/verify-otp',
  '/admin/header',
  '/user/header',
  '/seller/header',
  '/affiliate/header',
  '/headerfrontpage'
];

// Handle exact route refreshes
allowedRoutes.forEach(route => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
});

// Handle dynamic React Router routes
app.get('/product/public/*', (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});
app.get('/seller/*', (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
