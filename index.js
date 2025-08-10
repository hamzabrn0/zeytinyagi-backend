require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRouter = require("./routes/auth");
const productRoutes = require("./routes/products");
const { authenticateToken, authorizeRoles } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // JSON veri boyutu sınırı arttırıldı
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// MongoDB Bağlantısı
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB bağlantısı başarılı"))
  .catch((err) => console.error("MongoDB bağlantı hatası:", err));

// Auth Router (Kayıt ve Giriş)
app.use("/auth", authRouter);

// Test Endpoint
app.get("/", (req, res) => {
  res.send("Backend çalışıyor!");
});

// Ürün Routes
app.use("/products", productRoutes);

// Server Başlat
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor.`);
});
