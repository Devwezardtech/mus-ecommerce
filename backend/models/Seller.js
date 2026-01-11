const mongoose = require("mongoose");

const SellerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one seller per user
    },
    bio: {
      type: String,
      default: "",
    },
    contact: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    avatar: {
      type: String, // Cloudinary / image URL
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Seller", SellerSchema);
