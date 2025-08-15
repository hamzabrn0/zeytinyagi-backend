const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Kayıt olma endpoint’i
router.post(
  "/register",
  body("username").isLength({ min: 3 }),
  body("password").isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;

    try {
      let user = await User.findOne({ username });
      if (user) return res.status(400).json({ message: "Kullanıcı zaten var" });

      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({
        username,
        password: hashedPassword,
      });

      await user.save();

      res.status(201).json({ message: "Kayıt başarılı" });
    } catch (err) {
      console.error("Register Hatası:", err);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  }
);

// Giriş yapma endpoint’i (log eklenmiş versiyon)
router.post(
  "/login",
  body("username").exists(),
  body("password").exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;
    console.log("Gelen login isteği:", { username, password });

    try {
      const user = await User.findOne({ username });
      if (!user) {
        console.warn("Kullanıcı bulunamadı:", username);
        return res.status(400).json({ message: "Kullanıcı bulunamadı" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.warn("Şifre eşleşmedi:", username);
        return res.status(400).json({ message: "Parola yanlış" });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      console.log("Giriş başarılı:", username);
      res.json({ token });
    } catch (err) {
      console.error("Login Hatası:", err);
      res.status(500).json({ message: "Sunucu hatası", error: err.message });
    }
  }
);

// Profil endpoint’i
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    res.json(user);
  } catch (err) {
    console.error("Profile Hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

module.exports = router;
