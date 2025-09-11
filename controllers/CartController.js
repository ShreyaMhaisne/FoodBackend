import UserModel from "../models/UserModel.js"

// Add item to user cart
const addToCart = async (req, res) => {
  try {
    console.log("req.body:", req.body); // check what's inside body

    const userId = req.userId;
    const itemId = req.body.itemId;

    if (!userId) return res.json({ success: false, message: "userId missing" });
    if (!itemId) return res.json({ success: false, message: "itemId missing" });

    const userData = await UserModel.findById(userId);
    console.log("userData:", userData);

    if (!userData) return res.json({ success: false, message: "User not found" });

    let cartData = userData.cartData || {};
    cartData[itemId] = (cartData[itemId] || 0) + 1;

    await UserModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Item added to cart" });

  } catch (error) {
    console.log("CATCH ERROR:", error);
    res.json({ success: false, message: "Error" });
  }
};

// remove items from userCart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId } = req.body;

    if (!userId) return res.json({ success: false, message: "userId missing" });
    if (!itemId) return res.json({ success: false, message: "itemId missing" });

    const userData = await UserModel.findById(userId);
    if (!userData) return res.json({ success: false, message: "User not found" });

    let cartData = userData.cartData || {};

    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] <= 0) {
        delete cartData[itemId];
      }

      await UserModel.findByIdAndUpdate(userId, { cartData });
      return res.json({ success: true, message: "Item removed from cart", cartData });
    } else {
      return res.json({ success: false, message: "Item not found in cart" });
    }
  } catch (error) {
    console.log("REMOVE CART ERROR:", error);
    res.json({ success: false, message: "Error removing item from cart" });
  }
};



// Fetch user cart data
const getCart = async (req, res) => {
  try {
    // console.log("req.userId:", req.userId);
    const userId = req.userId;

    const userData = await UserModel.findById(userId);
    console.log("userData:", userData);

    if (!userData) return res.json({ success: false, message: "User not found" });

    const cartData = userData.cartData || {};
    res.json({ success: true, cartData });

  } catch (error) {
    console.log("GET CART ERROR:", error); // check the real error
    res.json({ success: false, message: "Error fetching cart data" });
  }
};

export { addToCart, removeFromCart, getCart }