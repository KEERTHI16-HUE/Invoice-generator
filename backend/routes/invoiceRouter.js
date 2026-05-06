// routes/invoiceRouter.js

import express from "express";
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoiceController.js";

import { clerkMiddleware } from "@clerk/express";
import { upload } from "../middleware/upload.js";

const invoiceRouter = express.Router();

// 🔐 Clerk middleware (protect all routes)
invoiceRouter.use(clerkMiddleware());

/* ================= GET ROUTES ================= */

invoiceRouter.get("/", getInvoices);
invoiceRouter.get("/:id", getInvoiceById);

/* ================= POST (CREATE) ================= */
// 🔥 Multer added here
invoiceRouter.post(
  "/",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "stamp", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  createInvoice
);

/* ================= PUT (UPDATE) ================= */
// 🔥 Multer added here also
invoiceRouter.put(
  "/:id",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "stamp", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  updateInvoice
);

/* ================= DELETE ================= */

invoiceRouter.delete("/:id", deleteInvoice);

export default invoiceRouter;