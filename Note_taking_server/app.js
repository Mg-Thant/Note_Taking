const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
dotenv.config();

const noteRoute = require("./routes/note");
const authRoute = require("./routes/auth");

const app = express();

const storageConfigure = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilterConfigure = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());

app.use(
  multer({ storage: storageConfigure, fileFilter: fileFilterConfigure }).single(
    "image"
  )
);

app.use(noteRoute);
app.use(authRoute);

mongoose
  .connect(process.env.MONGODB_URL)
  .then((_) => {
    app.listen(8010);
    console.log("Connected to mongodb");
  })
  .catch((err) => console.log(err));
