const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
//const nodemailer = require("nodemailer");
const brevo = require("@getbrevo/brevo");
const router = express.Router();

const brevoClient = new brevo.TransactionalEmailsApi();

// Configure Brevo API Key
brevoClient.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);
console.log("BREVO_API_KEY:", process.env.BREVO_API_KEY);


// Function to send email
async function sendEmail(to, subject, html) {
  const emailData = {
    sender: { 
      name: process.env.BREVO_SENDER_NAME,
       email: process.env.BREVO_SENDER_EMAIL
       },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  };

  try {
    await brevoClient.sendTransacEmail(emailData);
    console.log(" Email sent to:", to);
  } catch (err) {
    console.error(" Email send failed:", err.response?.body || err.message);
    throw new Error("Failed to send email");
  }
}

/*

//this is old code of emailed

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

*/


// Signup with OTP
router.post("/signup", async (req, res) => {
  try {
    console.log("Signup payload:", req.body); // for debugging
    const { name, email, password, role } = req.body;

    if (!role || !["admin", "user", "seller", "affiliate", "delivery"].includes(role)) {
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

    try {
      await sendEmail(
        email,
        "Your OTP Code",
        `<h2>Your OTP: ${otp}</h2><p>Expires in 5 minutes.</p>`
      );
    } catch (err) {
      return res.status(500).json({ error: "Failed to send OTP email" });
    }

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
      expiresIn: "1d",
    });

    res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login OTP Request
router.post("/login-request-otp", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login OTP request:", email);

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid email or password" });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });
  if (!user.isVerified) return res.status(403).json({ error: "Please verify your email first" });

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 5 * 60 * 1000;

  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  const htmlContent = `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f7f9fc; padding: 40px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      
      <div style="background: linear-gradient(135deg, #4f46e5, #6366f1); color: white; text-align: center; padding: 20px 0;">
        <h2 style="margin: 0;"Secure Login Verification</h2>
      </div>
      
      <div style="padding: 30px; color: #333;">
        <p style="font-size: 16px;">Hi <strong>${user.name || "User"}</strong>,</p>
        <p style="font-size: 15px;">We received a request to log in to your account. Please use the one-time password (OTP) below to continue:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; background: #f1f5f9; border: 2px dashed #4f46e5; border-radius: 8px; padding: 16px 32px;">
            <span style="font-size: 30px; font-weight: bold; letter-spacing: 4px; color: #4f46e5;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #6b7280; margin-top: 8px;">Valid for the next 5 minutes</p>
        </div>

        <p style="font-size: 14px; color: #555;">If you didn’t request this login, please ignore this email or contact our support team immediately.</p>
        
        <p style="margin-top: 25px;">Best regards,<br><strong>The MUS E-Commerce Team</strong></p>
      </div>
      
      <div style="background: #f3f4f6; text-align: center; padding: 15px; font-size: 12px; color: #9ca3af;">
        © ${new Date().getFullYear()} MUS E-Commerce. All rights reserved.
      </div>
    </div>
  </div>
  `;

  try {
    await sendEmail(email, "Your MUS E-Commerce Login OTP", htmlContent);
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ error: "Failed to send login OTP email" });
  }
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
