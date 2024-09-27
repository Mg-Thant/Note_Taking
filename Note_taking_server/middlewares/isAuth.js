const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const isAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "User not authenticated!" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const isMatchToken = jwt.verify(token, process.env.JWT_KEY);
    if (!isMatchToken) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    req.userId = isMatchToken.userId;
    next();
  } catch (err) { 
    return res.status(401).json({ message: "User not authenticated!" });
  }
};

module.exports = isAuth;
