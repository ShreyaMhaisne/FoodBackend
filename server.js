import dotenv from "dotenv";
dotenv.config();

console.log("Stripe Key Loaded:", !!process.env.STRIPE_SECRET_KEY);
console.log("JWT Secret Loaded:", !!process.env.JWT_SECRET); 
console.log("Cloudinary Loaded:", {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY,
  secret: process.env.CLOUDINARY_API_SECRET ? "set" : "missing"
});
import express from "express"
import cloudinary from "./config/cloudinary.js";

import cors from "cors"
// import path from "path";   
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/FoodRoute.js"
import userRouter from "./routes/UseRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"

console.log("Cloudinary test:", cloudinary.config().cloud_name);
// app config
const app= express()
const port = process.env.PORT || 4000;

// middleware
app.use(cors({
  origin: [
    "http://localhost:5173",                 // admin local dev
    "http://localhost:5174",                 // admin local dev
    "https://food-admin-nu.vercel.app/",         // deployed admin
    "https://food-frontend-woad.vercel.app"  // normal user frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json()); 

// db  connection
connectDB();

app.use("/api/food",foodRouter)
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

app.get("/",(req,res)=>{
    res.send("API WORKING")
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`);
})

export default app;