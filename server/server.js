import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load server/.env regardless of where the process was spawned
dotenv.config({ path: path.resolve(__dirname, ".env") });

import express from "express";
import cors from "cors";
import connectDB, { checkDBStatus } from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins
app.use(cors());

// Set JSON body limit to 10MB to accommodate Base64 image payloads
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health Check / API Status
app.get("/", (req, res) => {
  const dbReady = checkDBStatus();
  res.json({
    status: "online",
    database: dbReady ? "connected to MongoDB Atlas" : "in-memory mode (configure password in server/.env for Atlas)",
    message: "ShowCase Product Gallery API is active and ready",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/products", productRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

// Start Server immediately so frontend never receives connection refused
app.listen(PORT, async () => {
  console.log(`\n✓ ShowCase Server running on port ${PORT}`);
  console.log(`✓ API URL: http://localhost:${PORT}/api/products`);
  
  // Attempt Database Connection
  const connected = await connectDB();
  if (!connected) {
    // Retry every 10 seconds in background
    const interval = setInterval(async () => {
      const ok = await connectDB();
      if (ok) clearInterval(interval);
    }, 10000);
  }
});
