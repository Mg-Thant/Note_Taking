const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/user");

exports.register = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation Failed",
      errorMessage: errors.array(),
    });
  }

  const { username, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hashedPass) => {
      return User.create({
        email,
        password: hashedPass,
        username,
      });
    })
    .then(() => {
      res.status(201).json({
        message: "User created",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        message: "Something went wrong",
      });
    });
};

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation Failed",
      errorMessage: errors.array(),
    });
  }
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Email not found" });
      }
      return bcrypt.compare(password, user.password).then((isMatched) => {
        if (!isMatched) {
          return res.status(401).json({ message: "Invalid user credentials" });
        }
        const jwt_token = jwt.sign(
          { email: user.email, userId: user._id },
          process.env.JWT_KEY,
          { expiresIn: "2h" }
        );
        return res.status(200).json({
          token: jwt_token,
          userId: user._id,
          user_email: user.email,
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        message: err.message,
      });
    });
};

exports.checkStatus = (req, res, next) => {
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
    res.status(200).json("OK");
    next();
  } catch (err) {
    return res.status(401).json({ message: "User not authenticated!" });
  }
};
