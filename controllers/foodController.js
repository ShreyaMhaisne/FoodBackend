import FoodModel from "../models/foodModels.js";
import cloudinary from "../config/cloudinary.js";

// Add food
export const addFood = async (req, res) => {
  try {
    const{ name, description, price, category  } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: "Image is required" });

    const newFood = new FoodModel({
     name,
      description,
      price,
      category,
      image: req.file.path, // Cloudinary URL
       imagePublicId: req.file.filename || req.file.public_id,
    });

    await newFood.save();
    res.json({ success: true, data: newFood });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// List food
export const listFood = async (req, res) => {
  try {
    const foods = await FoodModel.find();
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Remove food
export const removeFood = async (req, res) => {
  try {
    const { foodId } = req.body;

    // 1. Find the food item first
    const food = await FoodModel.findById(foodId);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }

    // 2. Delete the image from Cloudinary
    if (food.imagePublicId) {
      await cloudinary.uploader.destroy(food.imagePublicId);
    }

    // 3. Delete from MongoDB
    await FoodModel.findByIdAndDelete(foodId);

    res.json({ success: true, message: "Food removed successfully" });
  } catch (error) {
    console.error("Remove Food Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

