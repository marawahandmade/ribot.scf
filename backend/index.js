const express = require("express");
const { checkDatabaseConnection } = require("./utils/db_checker");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

// Impor modul routes
const authRoutes = require("./modules/Auth/routes");
const userRoutes = require("./modules/User/routes");
const { rmSync } = require("fs");

const app = express();
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  // 1. Cek Koneksi MySQL
  const isDbConnected = await checkDatabaseConnection();

  if (!isDbConnected) {
    // Jika koneksi gagal, keluar dari proses Node.js
    process.exit(1);
  }

  // --- MIDDLEWARE GLOBAL (STANDARD & AMAN) ---
  // 1. CORS
  app.use(cors());

  // 2. Body Parsers (Pasang secara Global)
  // express.json() akan mengabaikan multipart/form-data, jadi aman untuk Multer.
  // Ini memastikan req.body selalu terinisialisasi (minimal object kosong {}), tidak pernah undefined.
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // 3. Static Files
  app.use("/images", express.static(path.join(__dirname, "public", "images")));

  // --- ROUTE REGISTRATION ---
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);

  app.get("/", (req, res) => {
    res.send("Modular Apps API is running!");
  });
  app.listen(PORT, () => {
    console.log(`\n🌐 Server backend berjalan di port ${PORT}`);
  });
};

startServer();
