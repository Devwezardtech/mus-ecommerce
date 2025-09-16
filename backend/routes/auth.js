const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const router = express.Router();

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Signup with OTP
router.post("/signup", async (req, res) => {
  try {
    console.log("Signup payload:", req.body); // for debugging
    const { name, email, password, role } = req.body;

    if (!role || !["admin", "user", "seller", "affiliate"].includes(role)) {
      return res.status(400).json({ error: "Invalid role selected" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

    if (role === "admin") {
      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin) {
        return res.status(403).json({ error: "Only one admin account is allowed." });
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    const user = new User({ name, email, password, role, otp, otpExpires, isVerified: false });
    await user.save();

    await transporter.sendMail({
      from: `"OTP Verification" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `<h2>Your OTP: ${otp}</h2><p>Expires in 5 minutes.</p>`,
    });

    res.status(201).json({ message: "OTP sent to email", email });
  } catch (error) {
    console.error("Signup route failed:", error);
    res.status(500).json({ error: "Signup failed." });
  }
});

// OTP Verification
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });
  if (user.isVerified) return res.status(400).json({ error: "Already verified" });

  if (user.otp !== otp || Date.now() > user.otpExpires) {
    return res.status(400).json({ error: "Invalid or expired OTP" })
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.json({ message: "Email verified! You can now log in." });
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });
    if (!user.isVerified) return res.status(403).json({ error: "Please verify your email" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1y",
    });

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login OTP Request
router.post("/login-request-otp", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login OTP request:", email, password); // <- check frontend payload
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid email or password" });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });
  if (!user.isVerified) return res.status(403).json({ error: "Please verify your email first" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 5 * 60 * 1000;

  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  await transporter.sendMail({
    from: `"Login OTP" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for Login",
    html: `<h2>OTP: ${otp}</h2><p>Valid for 5 minutes</p>`,
  });

  res.json({ message: "OTP sent" });
});

// Login with OTP
router.post("/login-otp-verify", async (req, res) => {
  console.log("Login OTP payload:", req.body);
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  if (!user.otp || user.otp !== otp || Date.now() > user.otpExpires) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
});


// CHECK IF ADMIN EXISTS (for frontend UI toggle)
router.get("/admin-exists", async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    res.json({ exists: !!existingAdmin });
  } catch (err) {
    res.status(500).json({ error: "Server error checking admin" });
  }
});

// GET ALL USERS GROUPED BY ROLE
router.get("/all-users", async (req, res) => {
  try {
    const users = await User.find().select("-password -otp -otpExpires");
    const grouped = {
      users: users.filter(u => u.role === "user"),
      sellers: users.filter(u => u.role === "seller"),
      affiliates: users.filter(u => u.role === "affiliate"),
    };
    res.json(grouped);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET USER BY ID — must be last!
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -otp -otpExpires");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
