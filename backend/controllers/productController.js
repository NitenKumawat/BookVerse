const Product = require("../models/Product");

// ✅ Get All Products (With Optional Search, Category Filter & Pagination)
exports.getProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };

    const products = await Product.find(filter)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.status(200).json({ products, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Error fetching products", error });
  }
};

// ✅ Get Single Product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ message: "Error fetching product", error });
  }
};

// ✅ Add a New Product (Admin Only)
exports.addProduct = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { name, price, category, imageUrl, description, discount, rating } = req.body;
    if (!name || !price || !category || !imageUrl) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newProduct = await Product.create({ name, price, category, imageUrl, description, discount, rating });
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({ message: "Error adding product", error });
  }
};

// ✅ Update Product (Admin Only)
exports.updateProduct = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Error updating product", error });
  }
};

// ✅ Delete Product (Admin Only)
exports.deleteProduct = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Error deleting product", error });
  }
};

// ✅ Get All Unique Categories (🔹 FIX for 404 Error)exports.getCategories = async (req, res) => {


    // ✅ Get Unique Categories with One Sample Book Image
    exports.getCategories = async (req, res) => {
      try {
        const categories = await Product.aggregate([
          { $group: { _id: "$category", imageUrl: { $first: "$imageUrl" } } },
          { $project: { name: "$_id", imageUrl: 1, _id: 0 } }
        ]);
    
        res.status(200).json(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Error fetching categories" });
      }
    };
    
