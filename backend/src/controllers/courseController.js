const courseService = require('../services/courseService');
const addCourseService = require('../services/Admin/addCourse');
const deleteCourseService = require('../services/Admin/deleteCourse');
const updateCourseService = require('../services/Admin/updateCourse');
const addVideoService = require('../services/Admin/addvideo');
const deleteVideoService = require('../services/Admin/deleteVideo');
const uploadService = require('../services/Admin/uploadService');

const handleControllerError = (res, error, context) => {
    console.error(`Error in ${context}:`, error);
    const message = error?.message || "An error occurred";

    if (message.includes("required") || message.includes("already exists")) {
        return res.status(400).json({ message });
    }
    if (message.includes("not found")) {
        return res.status(404).json({ message });
    }
    return res.status(500).json({ message: "Internal server error" });
};

// GET /api/courses
exports.getAllCourses = async (req, res) => {
    try {
        const result = await courseService.getAllCourses();
        return res.status(200).json(result);
    } catch (error) {
        return handleControllerError(res, error, "getAllCourses controller");
    }
};

// GET /api/courses/:id
exports.getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await courseService.getCourseById(id);
        return res.status(200).json(result);
    } catch (error) {
        return handleControllerError(res, error, "getCourseById controller");
    }
};

// GET /api/courses/vdocipher-otp/:videoId
exports.getVdoCipherOtp = async (req, res) => {
    try {
        let { videoId } = req.params;
        const apiSecret = process.env.VDOCIPHER_API_SECRET;

        if (!apiSecret) {
            return res.status(500).json({
                message: "VDOCIPHER_API_SECRET is not configured in backend .env",
                otp: null,
                playbackInfo: null
            });
        }

        // Clean & extract 32-hex ID if full URL or extra characters were passed
        if (videoId) {
            videoId = videoId.trim();
            const hexMatch = videoId.match(/([a-fA-F0-9]{32})/);
            if (hexMatch) {
                videoId = hexMatch[1].toLowerCase();
            }
        }

        if (!videoId || !/^[a-fA-F0-9]{32}$/.test(videoId)) {
            return res.status(400).json({
                message: `Invalid VdoCipher Video ID format: "${req.params.videoId}". Must contain a 32-character hexadecimal ID.`,
                otp: null,
                playbackInfo: null
            });
        }

        const apiResponse = await fetch(`https://dev.vdocipher.com/api/videos/${videoId}/otp`, {
            method: 'POST',
            headers: {
                'Authorization': `Apisecret ${apiSecret}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ttl: 300 })
        });

        const data = await apiResponse.json();

        if (!apiResponse.ok || !data.otp) {
            console.error(`VdoCipher API Error for videoId ${videoId}:`, data);
            return res.status(apiResponse.status || 400).json({
                message: data.message || data.error || "VdoCipher could not authenticate this video. Check if the video is ready in your VdoCipher dashboard.",
                otp: null,
                playbackInfo: null
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("Error generating VdoCipher OTP:", error);
        return res.status(500).json({ 
            message: "Failed to obtain VdoCipher playback OTP. Check backend connection.",
            otp: null,
            playbackInfo: null
        });
    }
};

// POST /api/courses/upload-image (Admin)
exports.uploadImage = async (req, res) => {
    try {
        const { image } = req.body;
        if (!image) {
            return res.status(400).json({ message: "Image payload is required" });
        }
        const result = await uploadService.uploadImage(image);
        return res.status(200).json(result);
    } catch (error) {
        return handleControllerError(res, error, "uploadImage controller");
    }
};

// POST /api/courses (Admin)
exports.createCourse = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { title, description, price, category, level, thumbnail, course_title, course_description } = req.body;
        
        const result = await addCourseService.addCourse({
            user_id,
            course_title: course_title || title,
            course_description: course_description || description || '',
            price: price !== undefined ? price : 0,
            category: category || 'Web Development',
            level: level || 'Intermediate',
            thumbnail: thumbnail || null
        });

        return res.status(201).json(result);
    } catch (error) {
        return handleControllerError(res, error, "createCourse controller");
    }
};

// PUT /api/courses/:id (Admin)
exports.updateCourse = async (req, res) => {
    try {
        const courseId = Number(req.params.id);
        const { title, description, price, category, level, thumbnail, course_title, course_description } = req.body;
        
        const result = await updateCourseService.updateCourse({
            courseId,
            course_title: course_title || title,
            course_description: course_description || description || '',
            price: price !== undefined ? price : 0,
            category: category || 'Web Development',
            level: level || 'Intermediate',
            thumbnail: thumbnail || null
        });

        return res.status(200).json(result);
    } catch (error) {
        return handleControllerError(res, error, "updateCourse controller");
    }
};

// DELETE /api/courses/:id (Admin)
exports.deleteCourse = async (req, res) => {
    try {
        const courseId = Number(req.params.id);
        const userid = req.user.id;
        
        const result = await deleteCourseService.deleteCourse({
            userid,
            courseId
        });

        return res.status(200).json(result);
    } catch (error) {
        return handleControllerError(res, error, "deleteCourse controller");
    }
};

// POST /api/courses/:courseId/videos (Admin)
exports.addVideo = async (req, res) => {
    try {
        const course_id = Number(req.params.courseId);
        const user_id = req.user.id;
        const { title, url, description, video_title, video_url, video_description } = req.body;

        const result = await addVideoService.upload_video({
            user_id,
            course_id,
            video_title: video_title || title,
            video_url: video_url || url,
            video_description: video_description || description || ''
        });

        return res.status(201).json(result);
    } catch (error) {
        return handleControllerError(res, error, "addVideo controller");
    }
};

// DELETE /api/courses/:courseId/videos/:videoId or /api/courses/videos/:videoId (Admin)
exports.deleteVideo = async (req, res) => {
    try {
        const courseId = req.params.courseId ? Number(req.params.courseId) : null;
        const videoId = Number(req.params.videoId);
        const user_id = req.user.id;

        const result = await deleteVideoService.deleteVideo({
            videoId,
            user_id,
            courseId
        });

        return res.status(200).json(result);
    } catch (error) {
        return handleControllerError(res, error, "deleteVideo controller");
    }
};
