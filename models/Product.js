const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Ürün adı
  description: { type: String, required: true }, // Ürün açıklaması
  price: { type: Number, required: true }, // Fiyat (Number tipinde)
  category: { type: String, required: true }, // Kategori
  images: { type: [String], required: true }, // Base64 veya URL dizisi
  stock: { type: Number, required: true }, // Stok adedi
}, { timestamps: true }); // createdAt ve updatedAt otomatik ekler

module.exports = mongoose.model("Product", productSchema);
