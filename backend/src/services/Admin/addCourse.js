const prisma = require('../config/prisma');

exports.addCourse = async (data) => {
    const { user_id, course_title, course_description, price } = data;

    if (!user_id || !course_title || !course_description || price === undefined || price === null) {
        throw new Error("All fields are required");
    }

    try {
        const existingCourse = await prisma.course.findFirst({
            where: {
                userId: user_id,
                title: course_title
            }
        });

        if (existingCourse) {
            throw new Error("Course with this title already exists");
        }

        const course = await prisma.course.create({
            data: {
                title: course_title,
                description: course_description,
                price: parseFloat(price),
                userId: user_id
            }
        });

        return { message: "Course added successfully", course };
    } catch (error) {
        throw new Error(error.message);
    }
};
