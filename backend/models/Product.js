const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },

     // Cloudinary support:
    photo: [{ type: String }],     // Public URL from Cloudinary
    photoId: [{ type: String }],   // Cloudinary public_id (for deletion)

  stock: { type: Number, required: true, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  commission: { type: Number, default: 0.2 }, // 20% by default
}, { timestamps: true }); // optional: adds createdAt & updatedAt

module.exports = mongoose.model("Product", ProductSchema);
 