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
        throw new Error(error.message);
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
        throw new Error(error.message);
    }
};
