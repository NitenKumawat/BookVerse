const express = require("express");
const { 
  getProducts, 
  getProductById, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  getCategories // ✅ Added this to fix category API issue
} = require("../controllers/productController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getProducts); // Get all products
router.get("/categories", getCategories); // ✅ Get all unique categories (Fix for 404)
router.get("/:id", getProductById); // Get product by ID
router.post("/", verifyToken, addProduct); // Add product (Admin Only)
router.put("/:id", verifyToken, updateProduct); // Update product (Admin Only)
router.delete("/:id", verifyToken, deleteProduct); // Delete product (Admin Only)

module.exports = router;
