const dotenv = require("dotenv");

dotenv.config();

const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_NAME", "JWT_SECRET"];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Falta la variable de entorno ${envVar}`);
  }
}

module.exports = {
  port: Number(process.env.PORT) || 3000,
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD || "",
  dbName: process.env.DB_NAME,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
};
