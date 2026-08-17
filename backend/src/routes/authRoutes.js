const express= require("express");

const router = express.Router();

const authController = require("../controllers/authController");

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.post("/verify-otp", authController.verifyOtp);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;