import FoodModel from "../models/foodModels.js";

// Add food
export const addFood = async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: "Image is required" });

    const newFood = new FoodModel({
      name,
      price,
      image: req.file.path, // Cloudinary URL
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
    await FoodModel.findByIdAndDelete(foodId);
    res.json({ success: true, message: "Food removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
