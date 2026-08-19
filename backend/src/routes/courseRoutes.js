const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware');

// Public course endpoints
router.get('/', courseController.getAllCourses);
router.get('/vdocipher-otp/:videoId', courseController.getVdoCipherOtp);
router.get('/:id', courseController.getCourseById);

// Admin image upload (Cloudinary)
router.post('/upload-image', authenticateUser, authorizeAdmin, courseController.uploadImage);

// Admin course management endpoints
router.post('/', authenticateUser, authorizeAdmin, courseController.createCourse);
router.put('/:id', authenticateUser, authorizeAdmin, courseController.updateCourse);
router.delete('/:id', authenticateUser, authorizeAdmin, courseController.deleteCourse);

// Admin video management endpoints
router.post('/:courseId/videos', authenticateUser, authorizeAdmin, courseController.addVideo);
router.delete('/:courseId/videos/:videoId', authenticateUser, authorizeAdmin, courseController.deleteVideo);

module.exports = router;
