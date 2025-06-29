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
//const chatRoutes = require("./routes/chat"); //Correct import
const affiliateRoutes = require("./routes/affiliate");
const stripeRoutes = require('./routes/stripe');



const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
//app.use("/api", chatRoutes); // Gemini AI chat route
app.use("/api/affiliate", affiliateRoutes);
app.use("/api/users", require("./routes/auth")); // mounts auth.js as /api/users
app.use('/api/stripe', stripeRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
