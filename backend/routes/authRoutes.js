const express = require("express");
const { register, login, getUserDetails, logout } = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getUserDetails);
router.post("/logout", logout);

module.exports = router;
