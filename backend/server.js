require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
//const history = require("connect-history-api-fallback");

const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const paymentRoutes = require("./routes/paymentRoutes");
const affiliateRoutes = require("./routes/affiliate");
const stripeRoutes = require('./routes/stripe');
const adminRoutes = require('./routes/adminRoutes');


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
app.use('/api/admin', adminRoutes);

// Serve static frontend
const staticPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(staticPath));

// Whitelisted client-side routes (for React Router) if app.jsx can chnage to HashRouter with browserRouter
// This allows React Router to handle routing on the client side
{/*const allowedRoutes = [
  '/', '/login', '/signup', '/checkout', '/orders', '/cart',
  '/admin', '/admin/orders', '/user', '/user/orders',
  '/affiliate', '/affiliate/orders', '/affiliate/showcase',
  '/affiliate/withdraw', '/affiliateproduct', '/seller',
  '/seller/orders', '/seller/profile', '/profile', '/verify-otp',
  '/admin/header', '/user/header', '/seller/header',
  '/affiliate/header', '/headerfrontpage'
];

allowedRoutes.forEach(route => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
});

// Dynamic routes
app.get('/product/public/*', (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});
app.get('/seller/*', (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});
app.get("/affiliate/*", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});
*/}

// Fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
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
