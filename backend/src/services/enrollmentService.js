const prisma = require('../config/prisma');

exports.getUserEnrollments = async (data) => {
    const { userId } = data;

    if (!userId) {
        throw new Error("User ID is required");
    }

    try {
        const enrollments = await prisma.enrollment.findMany({
            where: { userId: Number(userId) },
            include: {
                course: {
                    include: {
                        videos: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return { enrollments };
    } catch (error) {
        console.error("Database error in getUserEnrollments:", error);
        throw new Error(error.message || "Failed to fetch user enrollments from database");
    }
};

exports.checkEnrollmentStatus = async (data) => {
    const { userId, courseId } = data;

    if (!userId || !courseId) {
        throw new Error("User ID and Course ID are required");
    }

    try {
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: Number(userId),
                    courseId: Number(courseId)
                }
            }
        });

        return { isEnrolled: Boolean(enrollment) };
    } catch (error) {
        console.error("Database error in checkEnrollmentStatus:", error);
        throw new Error(error.message || "Failed to check enrollment status in database");
    }
};
