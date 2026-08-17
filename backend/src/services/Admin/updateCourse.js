const prisma = require('../config/prisma');

exports.updateCourse = async (data) => {
    const { courseId, course_title, course_description, price } = data;

    if (!courseId || !course_title || !course_description || price === undefined || price === null) {
        throw new Error("All fields are required");
    }

    try {
        const course = await prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            throw new Error("Course not found");
        }

        await prisma.course.update({
            where: { id: courseId },
            data: {
                title: course_title,
                description: course_description,
                price: parseFloat(price)
            }
        });

        return { message: "Course updated successfully" };
    } catch (error) {
        throw new Error(error.message);
    }
};
