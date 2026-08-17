const prisma = require('../config/prisma');

exports.deleteCourse = async (data) => {
    const { userid, courseId } = data;

    if (!courseId) {
        throw new Error("Course ID is required");
    }

    try {
        const course = await prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            throw new Error("Course not found");
        }

        await prisma.course.delete({
            where: { id: courseId },
        });

        return { message: "Course deleted successfully" };
    } catch (error) {
        throw new Error(error.message);
    }
};
