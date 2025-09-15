import dotenv from "dotenv";
dotenv.config();  

import { response } from "express";
import orderModel from "../models/orderModel.js";
import userModel from "../models/UserModel.js";
import Stripe from "stripe"


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

console.log("Stripe Key Loaded:", !!process.env.STRIPE_SECRET_KEY);
// Conversion rate for demo: 1 USD = 82 INR
const INR_TO_USD = 82;
const convertInrToUsd = (inrAmount) => {
  return Math.round((inrAmount / INR_TO_USD) * 100); // Stripe expects cents
};


// placing user order for frontend

const placeOrder = async (req, res) => {
  const frontend_url = "https://food-frontend-woad.vercel.app";
  try {
    const userId = req.userId;   // coming from middleware
    const { items, amount, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order." });
    }

    // Save order
    const newOrder = new orderModel({ userId, items, amount, address });
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Prepare line items
    const line_items = items.map(item => ({
      price_data: {
        currency: "usd",

        product_data: { name: item.name },
        unit_amount: convertInrToUsd(Number(item.price)), // ensure number
      },
      quantity: item.quantity,
    }));

    // Add delivery fee
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Delivery Charges" },
        unit_amount: convertInrToUsd(70),
      },
      quantity: 1,
    });

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Stripe / Order error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

const verifyOrder = async (req,res)=>{
  const{orderId,success}=req.body;
  try {
    
    if (success=="true") {
      await orderModel.findByIdAndUpdate(orderId,{payment:true});
      res.json({success:true,message:"Paid"})
    }
    else{
      await orderModel.findByIdAndDelete(orderId);
      res.json({success:false,message:"Not Paid"})
    }
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"});
    
  }
}

// user order for frontend
const userOrders = async (req, res) => {
  try {
    const userId = req.userId; // <-- get from authMiddleware
    const orders = await orderModel.find({ userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching orders" });
  }
};

// Listing orders for admin panel
const listOrders = async (req,res)=>{
try {
  const orders=await orderModel.find({});
  res.json({success:true,data:orders})
} catch (error) {
  console.log(error);
  res.json({success:false,message:"Error"})
}
}

//api for updating order status
const updateStatus = async (req,res)=>{
try {
  await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
  res.json({success:true,message:"Status Updated"})
} catch (error) {
  console.log(error);
  res.json({success:false,message:"Error"})
}
}

export { placeOrder,verifyOrder,userOrders ,listOrders,updateStatus}