const express = require("express");
const { getCart, addToCart, updateCart, removeFromCart, clearCart } = require("../controllers/cartController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, getCart);
router.post("/add", verifyToken, addToCart);
router.put("/update/:id", verifyToken, updateCart);
router.delete("/remove/:id", verifyToken, removeFromCart);
router.delete("/clear", verifyToken, clearCart);

module.exports = router;
