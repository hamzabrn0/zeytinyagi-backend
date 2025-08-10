require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Port ayarı (env dosyasında yoksa 4000 kullan)
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Basit test endpointi
app.get("/", (req, res) => {
  res.send("Backend server is running");
});

// MongoDB bağlantısı (örn. .env içinde MONGO_URI var ise bağlan)
// Burayı kendi connection string'ine göre düzenle
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Server başlatma
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
