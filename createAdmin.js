require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/user"); // küçük harf ile

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const username = "admin";   // istediğin kullanıcı adı
    const password = "sebar190125"; // istediğin şifre
    const hashedPassword = await bcrypt.hash(password, 10);

    // Zaten var mı kontrol et
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("⚠️ Admin zaten mevcut.");
    } else {
      const adminUser = new User({
        username,
        password: hashedPassword,
        role: "admin",
      });
      await adminUser.save();
      console.log("✅ Admin user created:", username);
    }

    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Hata:", err);
  }
}

createAdmin();
