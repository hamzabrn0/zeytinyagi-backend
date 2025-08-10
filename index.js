require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const musteriRoutes = require("./routes/musteriler");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // base64 resimler için limit yükseltildi

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/musteriler", musteriRoutes);

// Test endpoint
app.get("/", (req, res) => {
  res.send("Backend server is running 🚀");
});

// MongoDB bağlantısı
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ MongoDB bağlantısı başarılı");

    // Admin kullanıcıyı otomatik oluşturma
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "123456";

    const existingAdmin = await User.findOne({ username: adminUsername });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const newAdmin = new User({
        username: adminUsername,
        password: hashedPassword,
        role: "admin",
      });
      await newAdmin.save();
      console.log(`✅ Admin kullanıcı oluşturuldu -> ${adminUsername}`);
    } else {
      console.log(`ℹ️ Admin kullanıcı zaten var -> ${adminUsername}`);
    }
  })
  .catch((err) => console.error("❌ MongoDB bağlantı hatası:", err));

// Sunucu başlat
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
