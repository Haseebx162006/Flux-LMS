const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateUser, authorizeAdmin } = require("../middleware/authMiddleware");

// Public authentication endpoints
router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.post("/verify-otp", authController.verifyOtp);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Admin User Management endpoints (Admin only)
router.get("/users", authenticateUser, authorizeAdmin, authController.getAllUsers);
router.put("/users/:userId/block", authenticateUser, authorizeAdmin, authController.toggleBlockUser);

module.exports = router;