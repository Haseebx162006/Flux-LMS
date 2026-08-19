const prisma = require('../../config/prisma');

exports.addCourse = async (data) => {
    const { user_id, course_title, course_description, price } = data;

    const cleanTitle = String(course_title || '').trim();
    const cleanDescription = String(course_description || cleanTitle || 'Course overview').trim();
    const parsedPrice = (price !== undefined && price !== null && !isNaN(Number(price))) ? Number(price) : 0;

    if (!user_id || !cleanTitle) {
        throw new Error("User ID and Course Title are required");
    }

    try {
        const existingCourse = await prisma.course.findFirst({
            where: {
                title: cleanTitle
            }
        });

        if (existingCourse) {
            // Update existing course details
            const updatedCourse = await prisma.course.update({
                where: { id: existingCourse.id },
                data: {
                    description: cleanDescription,
                    price: parsedPrice
                }
            });
            return { message: "Course updated successfully", course: updatedCourse };
        }

        const course = await prisma.course.create({
            data: {
                title: cleanTitle,
                description: cleanDescription,
                price: parsedPrice,
                userId: Number(user_id)
            }
        });

        return { message: "Course added successfully", course };
    } catch (error) {
        console.error("Error in addCourse service:", error);
        throw new Error(error.message || "Failed to create course");
    }
};
