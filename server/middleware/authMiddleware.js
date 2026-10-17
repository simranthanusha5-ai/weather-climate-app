const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protects routes by requiring a valid JWT in the Authorization header.
// Format expected: "Authorization: Bearer <token>"
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user (without password) to the request object
      // so later route handlers know who is making the request.
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found. Invalid token." });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized. Invalid or expired token." });
    }
  } else {
    return res.status(401).json({ message: "Not authorized. No token provided." });
  }
};

module.exports = { protect };
