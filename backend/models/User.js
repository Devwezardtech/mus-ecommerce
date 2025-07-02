const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user", "seller", "affiliate"], default: "user" },
  otp: { type: String },
  otpExpires: { type: Number },
  isVerified: { type: Boolean, default: false },
  refCode: {
  type: String,
  unique: true,
  sparse: true, // allows null but ensures uniqueness when used
},
showcase: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
stripeAccountId: {
  type: String, // Save their Stripe Connect ID
  default: null,
},


});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);