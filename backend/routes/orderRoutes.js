const express = require("express");
const { placeOrder, getUserOrders, getOrderById, updateOrderStatus, cancelOrder } = require("../controllers/orderController");
const verifyToken = require("../middleware/authMiddleware"); // Ensure user is logged in


const router = express.Router();

router.post("/place", verifyToken, placeOrder);
router.get("/", verifyToken, getUserOrders);
router.get("/:id", verifyToken, getOrderById);
router.put("/:id/status", verifyToken, updateOrderStatus);
router.put("/:id/cancel", verifyToken, cancelOrder);

module.exports = router;
