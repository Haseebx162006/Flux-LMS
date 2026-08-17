const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.get('/my-courses', authenticateUser, enrollmentController.getUserEnrollments);
router.get('/status/:courseId', authenticateUser, enrollmentController.checkEnrollmentStatus);

module.exports = router;
