const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Pastikan ini ada

// koneksi ke database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("berhasil terkoneksi ke database");
  })
  .catch((err) => {
    console.log(err);
  });

//   routes
app.use("/", require("./routes/sortRoutes"));

// jalankan server
app.listen(process.env.PORT, () => {
  console.log(`server berjalan di port http://localhost:${PORT}`);
});
