require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ----------------- CORS CONFIG -----------------
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://mus-ecommerce-shop.onrender.com",
  process.env.CLIENT_ORIGIN, // optional
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman, server-to-server

      // check if origin starts with any allowed domain
      if (allowedOrigins.some(o => origin.startsWith(o))) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed for: " + origin), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);


// ----------------- MIDDLEWARE -----------------
app.use(express.json());

// ----------------- ROUTES -----------------
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const paymentRoutes = require("./routes/paymentRoutes");
const affiliateRoutes = require("./routes/affiliate");
const stripeRoutes = require("./routes/stripe");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/affiliate", affiliateRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/admin", adminRoutes);

// ----------------- SERVE FRONTEND -----------------
const staticPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(staticPath));

// Root route
app.get("/", (req, res) => {
  res.send("<h1> Backend is running successfully!</h1>");
});

// Fallback for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

// ----------------- MONGODB CONNECTION -----------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// ----------------- START SERVER -----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
