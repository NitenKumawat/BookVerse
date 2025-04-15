const Order = require("../models/Order");
const Cart = require("../models/Cart"); // Assuming you have a cart model
const Product = require("../models/Product"); // To check product details

// 🛒 Place an Order
exports.placeOrder = async (req, res) => {
  try {
    const { paymentMethod, address } = req.body;
    const userId = req.user.id; // Assuming you have authentication middleware

    // Fetch user's cart
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total price and discount
    let totalAmount = 0;
    let totalDiscount = 0;
    const items = cart.items.map((item) => {
      const { productId, quantity } = item;
      const discountAmount = (productId.price * (productId.discount / 100)) * quantity;
      totalDiscount += discountAmount;
      totalAmount += (productId.price * quantity) - discountAmount;

      return {
        productId: productId._id,
        name: productId.name,
        imageUrl: productId.imageUrl,
        price: productId.price,
        discount: productId.discount,
        quantity,
      };
    });

    // Create new order
    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      discountApplied: totalDiscount,
      paymentMethod,
      address,
      status: "Pending",
      paymentStatus: "Pending", // ✅ FIXED
    });

    await newOrder.save();

    // Clear the cart after order is placed
    await Cart.findOneAndDelete({ userId });

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Failed to place order", error: error.message });
  }
};

// 📦 Get Orders of a User
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// 🛍️ Get Single Order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
};

// 🚚 Update Order Status (Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
};

// ❌ Cancel Order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Pending") {
      return res.status(400).json({ message: "Only pending orders can be canceled" });
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel order", error: error.message });
  }
};
