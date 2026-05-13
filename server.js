const express = require("express");
const cors = require("cors");
const env = require("./src/config/env");
const storeRoutes = require("./src/routes/storeRoutes");
const productRoutes = require("./src/routes/productRoutes");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
  }),
);

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stores", storeRoutes);
const uploadsDir = path.join(__dirname, "uploads");
const productsUploadsDir = path.join(uploadsDir, "products");

if (!fs.existsSync(productsUploadsDir)) {
  fs.mkdirSync(productsUploadsDir, { recursive: true });
}

app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("API Marketplace funcionando");
});

app.listen(env.port, () => {
  console.log(`Servidor corriendo en http://localhost:${env.port}`);
});
