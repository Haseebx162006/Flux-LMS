const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.post('/checkout-session', authenticateUser, paymentController.createCheckoutSession);
router.post('/verify', authenticateUser, paymentController.verifyPayment);
router.get('/history', authenticateUser, paymentController.getUserPayments);

module.exports = router;
