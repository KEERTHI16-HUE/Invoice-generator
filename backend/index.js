import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import path from "path";

import { clerkMiddleware } from "@clerk/express";
import { connectDB } from "./config/db.js";

import businessProfileRouter from "./routes/businessProfileRouter.js";
import invoiceRouter from "./routes/invoiceRouter.js";
import aiInvoiceRouter from "./routes/aiInvoiceRouter.js";

const app = express();
const port = process.env.PORT || 4000;

/* ================= MIDDLEWARE ================= */

// ✅ CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

// ✅ Debug logger (optional but useful)
app.use((req, res, next) => {
  console.log("📡", req.method, req.url);
  next();
});

// ✅ Clerk
app.use(clerkMiddleware());

// ✅ Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

/* ================= DATABASE ================= */

connectDB();

/* ================= STATIC ================= */

// ✅ IMPORTANT (for images)
// app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ================= ROUTES ================= */

app.use("/api/businessProfile", businessProfileRouter);
app.use("/api/invoices", invoiceRouter);
app.use("/api/ai", aiInvoiceRouter);

/* ================= TEST ================= */

app.get("/", (req, res) => {
  res.send("API Working with Clerk Auth");
});

/* ================= ERROR ================= */

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ================= START ================= */

app.listen(port, () => {
  console.log(`🚀 Server Started on http://localhost:${port}`);
});