const Cart = require("../models/Cart");

// Get User's Cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id })
      .populate("items.productId")
      .lean(); // Optimize performance
    res.json(cart || { items: [] });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
};

// Add Item to Cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || isNaN(quantity) || quantity < 1) {
    return res.status(400).json({ message: "Invalid product ID or quantity" });
  }

  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [{ productId, quantity }] });
    } else {
      const item = cart.items.find((item) => item.productId.toString() === productId);
      if (item) {
        item.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    await cart.populate("items.productId");

    // ✅ Find the updated item inside the cart
    const updatedItem = cart.items.find((item) => item.productId._id.toString() === productId);
    if (!updatedItem) return res.status(500).json({ message: "Item not found in cart after update" });

    res.json({ message: "Item added to cart", item: updatedItem });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
};

// Update Cart Item Quantity
exports.updateCart = async (req, res) => {
  const { quantity } = req.body;
  try {
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((item) => item.productId.toString() === req.params.id);
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.productId");

    console.log("Updated Cart:", cart); // ✅ Debug log
    res.json({ message: "Cart updated", item });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Error updating cart", error: error.message });
  }
};

// Remove Item from Cart
exports.removeFromCart = async (req, res) => {
  try {
    let cart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $pull: { items: { productId: req.params.id } } },
      { new: true }
    ).populate("items.productId");

    // If cart exists but has no items left, return an empty cart
    if (cart && cart.items.length === 0) {
      return res.json({ message: "Item removed", cart: { items: [] } });
    }

    res.json({ message: "Item removed", cart });
  } catch (error) {
    console.error("Error removing item:", error);
    res.status(500).json({ message: "Error removing item", error: error.message });
  }
};

// Clear Cart
exports.clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { items: [] },
      { new: true }
    ).populate("items.productId");

    res.json({ message: "Cart cleared", cart: cart || { items: [] } });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Error clearing cart", error: error.message });
  }
};
