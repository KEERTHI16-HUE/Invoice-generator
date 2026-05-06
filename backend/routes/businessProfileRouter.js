// import express from "express";
// import multer from "multer";
// import path from "path";
// import {
//   createBusinessProfile,
//   getMyBusinessProfile,
//   updateBusinessProfile,
// } from "../controllers/businessProfileController.js";
// import { clerkMiddleware } from "@clerk/express";

// const businessProfileRouter = express.Router();

// // Enable Clerk auth on all routes
// businessProfileRouter.use(clerkMiddleware());

// // Multer setup for file uploads (logo, stamp, signature)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(process.cwd(), "uploads"));
//   },
//   filename: (req, file, cb) => {
//     const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     cb(null, `business-${unique}${ext}`);
//   },
// });
// const upload = multer({ storage });

// // Create Business Profile
// businessProfileRouter.post(
//   "/",
//   upload.fields([
//     { name: "logoName", maxCount: 1 },
//     { name: "stampName", maxCount: 1 },
//     { name: "signatureNameMeta", maxCount: 1 },
//   ]),
//   createBusinessProfile
// );

// // Update Business Profile
// businessProfileRouter.put(
//   "/:id",
//   upload.fields([
//     { name: "logoName", maxCount: 1 },
//     { name: "stampName", maxCount: 1 },
//     { name: "signatureNameMeta", maxCount: 1 },
//   ]),
//   updateBusinessProfile
// );

// // Get logged-in user's profile
// businessProfileRouter.get("/me", getMyBusinessProfile);

// export default businessProfileRouter;
import express from "express";
import multer from "multer";
import path from "path";
import {
  createBusinessProfile,
  getMyBusinessProfile,
  updateBusinessProfile,
} from "../controllers/businessProfileController.js";
import { clerkMiddleware } from "@clerk/express";

const businessProfileRouter = express.Router();

// Enable Clerk auth on all routes
businessProfileRouter.use(clerkMiddleware());

// Multer setup for file uploads (logo, stamp, signature)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `business-${unique}${ext}`);
  },
});
const upload = multer({ storage });

// Create Business Profile
businessProfileRouter.post(
  "/",
  upload.fields([
    { name: "logoName", maxCount: 1 },
    { name: "stampName", maxCount: 1 },
    { name: "signatureNameMeta", maxCount: 1 },
  ]),
  createBusinessProfile
);

// Update Business Profile
businessProfileRouter.put(
  "/:id",
  upload.fields([
    { name: "logoName", maxCount: 1 },
    { name: "stampName", maxCount: 1 },
    { name: "signatureNameMeta", maxCount: 1 },
  ]),
  updateBusinessProfile
);

// Get logged-in user's profile
businessProfileRouter.get("/me", getMyBusinessProfile);

// ✅ NEW — standalone asset upload (logo/stamp/signature from CreateInvoice)
// ⚠️ Must be ABOVE /:id route to avoid Express treating "upload-asset" as an id
businessProfileRouter.post(
  "/upload-asset",
  upload.fields([
    { name: "logoName", maxCount: 1 },
    { name: "stampName", maxCount: 1 },
    { name: "signatureNameMeta", maxCount: 1 },
  ]),
  (req, res) => {
    const files = req.files || {};
    const file =
      (files.logoName && files.logoName[0]) ||
      (files.stampName && files.stampName[0]) ||
      (files.signatureNameMeta && files.signatureNameMeta[0]);

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const url = `http://localhost:4000/uploads/${file.filename}`;
    return res.status(200).json({ success: true, url });
  }
);

export default businessProfileRouter;