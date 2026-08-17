const enrollmentService = require("../services/enrollmentService");

const handleControllerError = (res, error, context) => {
    console.error(`Error in ${context}:`, error);
    const message = error?.message || "An error occurred";

    if (message.includes("required")) {
        return res.status(400).json({ message });
    }

    if (message.includes("not found")) {
        return res.status(404).json({ message });
    }

    return res.status(500).json({ message: "Internal server error" });
};

exports.getUserEnrollments = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await enrollmentService.getUserEnrollments({ userId });
        return res.status(200).json(result);
    } catch (error) {
        return handleControllerError(res, error, "getUserEnrollments controller");
    }
};

exports.checkEnrollmentStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId } = req.params;
        const result = await enrollmentService.checkEnrollmentStatus({ userId, courseId });
        return res.status(200).json(result);
    } catch (error) {
        return handleControllerError(res, error, "checkEnrollmentStatus controller");
    }
};
