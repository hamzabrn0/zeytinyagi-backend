const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

// Tüm ürünleri listele (herkese açık)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Yeni ürün ekle (sadece admin) — base64 images JSON içinde geliyor
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { title, description, price, category, stock, images } = req.body;

      const newProduct = new Product({
        title,
        description,
        price,
        category,
        stock,
        images, // base64 dizisi frontend'den JSON içinde geliyor
      });

      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Ürün güncelle (sadece admin) — images yoksa eski resimleri koru
router.put("/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (!updateData.images) {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: "Ürün bulunamadı" });
      updateData.images = product.images;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Ürün sil (sadece admin)
router.delete("/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Ürün bulunamadı" });
    res.json({ message: "Ürün silindi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
