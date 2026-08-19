const prisma = require('../config/prisma');

exports.getUserEnrollments = async (data) => {
    const { userId } = data;

    if (!userId) {
        throw new Error("User ID is required");
    }

    try {
        const cleanUserId = Number(userId);

        // Auto-heal / sync any paid courses where enrollment record might be missing
        const paidPayments = await prisma.payment.findMany({
            where: {
                userId: cleanUserId,
                status: 'PAID'
            }
        });

        for (const payment of paidPayments) {
            try {
                await prisma.enrollment.upsert({
                    where: {
                        userId_courseId: {
                            userId: cleanUserId,
                            courseId: payment.courseId
                        }
                    },
                    update: {},
                    create: {
                        userId: cleanUserId,
                        courseId: payment.courseId
                    }
                });
            } catch (syncErr) {
                console.warn("Enrollment sync notice:", syncErr.message);
            }
        }

        const enrollments = await prisma.enrollment.findMany({
            where: { userId: cleanUserId },
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
        const cleanUserId = Number(userId);
        const cleanCourseId = Number(courseId);

        let enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: cleanUserId,
                    courseId: cleanCourseId
                }
            }
        });

        // If not found in enrollment table, check if there is a verified PAID payment
        if (!enrollment) {
            const paidPayment = await prisma.payment.findFirst({
                where: {
                    userId: cleanUserId,
                    courseId: cleanCourseId,
                    status: 'PAID'
                }
            });

            if (paidPayment) {
                try {
                    enrollment = await prisma.enrollment.create({
                        data: {
                            userId: cleanUserId,
                            courseId: cleanCourseId
                        }
                    });
                } catch (e) {
                    console.warn("Auto enrollment creation note:", e.message);
                }
            }
        }

        return { isEnrolled: Boolean(enrollment) };
    } catch (error) {
        console.error("Database error in checkEnrollmentStatus:", error);
        throw new Error(error.message || "Failed to check enrollment status in database");
    }
};
