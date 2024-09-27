const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

// POST /register
router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Email must be email format")
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email is already exist!");
          }
        });
      }),
    body("username")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Username is too short")
      .isLength({ max: 15 })
      .withMessage("Username is too long")
      .custom((value, { req }) => {
        return User.findOne({ username: value }).then((user) => {
          if (user) {
            return Promise.reject("Username is already exist!");
          }
        });
      }),
    body("password")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Password is too short"),
  ],
  authController.register
);

// POST /login
router.post(
  "/login",
  body("email").isEmail().withMessage("Email must be email format!"),
  body("password")
    .trim()
    .isLength({ min: 4 })
    .withMessage("Password is too short"),
  authController.login
);

// GET /status
router.get("/status", authController.checkStatus);

module.exports = router;
