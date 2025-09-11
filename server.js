import dotenv from "dotenv";
dotenv.config();

console.log("Stripe Key Loaded:", !!process.env.STRIPE_SECRET_KEY);

import express from "express"
import cors from "cors"
import path from "path";   
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/FoodRoute.js"
import userRouter from "./routes/UseRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"


// app config
const app= express()
const port = process.env.PORT || 4000;

// middleware

app.use(express.json())
app.use(cors({
  origin: "https://my-food-frontend.vercel.app", // replace with your actual frontend URL
  credentials: true
}));

// db  connection
connectDB();

//api endpoint
// app.use("/api/upload", uploads);
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

app.get("/",(req,res)=>{
    res.send("API WORKING")
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`);
})