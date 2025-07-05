require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const history = require("connect-history-api-fallback"); // npm install connect-history-api-fallback / that is very important for React Router support like refreshing pages without 404 errors

const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const paymentRoutes = require("./routes/paymentRoutes");
const affiliateRoutes = require("./routes/affiliate");
const stripeRoutes = require('./routes/stripe');

const app = express();

// Middleware
// CORS setup (adjust origin to your frontend render link)
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

//  Use history fallback BEFORE static files
app.use(history()); //  THIS is the key for React Router support!

//server for frontend build in production
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// test for backend
app.get('/', (req, res) => {
  res.send('Backend is running 🎉');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
