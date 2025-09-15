import express from "express";
import multer from "multer";
import adminAuth from "../middleware/adminAuth.js"; 
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import authMiddleware from "../middleware/auth.js";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const foodRouter = express.Router();

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Home",  // folder in your Cloudinary account
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });
foodRouter.post("/add", authMiddleware, adminAuth, upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", authMiddleware, adminAuth, removeFood);
export default foodRouter;
