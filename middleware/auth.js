const jwt = require("jsonwebtoken");

// Token doğrulama middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token bulunamadı" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Geçersiz token" });
    req.user = user;
    next();
  });
}

// Admin rolü kontrolü middleware
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Bu işlemi yapmaya yetkiniz yok" });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRoles };
