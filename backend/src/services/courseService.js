const prisma = require('../config/prisma');

/**
 * Fetch all available courses from PostgreSQL database via Prisma.
 */
exports.getAllCourses = async () => {
    try {
        const courses = await prisma.course.findMany({
            include: {
                user: {
                    select: { id: true, name: true, email: true, role: true }
                },
                videos: true,
                reviews: {
                    include: {
                        user: { select: { id: true, name: true } }
                    }
                },
                enrollments: true
            },
            orderBy: { id: 'desc' }
        });

        const formattedCourses = courses.map(course => ({
            id: course.id,
            title: course.title,
            subtitle: course.description || 'Comprehensive learning track',
            description: course.description || '',
            price: course.price,
            category: course.category || 'Web Development',
            level: course.level || 'Intermediate',
            instructor: {
                name: course.user?.name || 'Instructor',
                role: 'Course Author',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
            },
            rating: course.reviews && course.reviews.length > 0
                ? Number((course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length).toFixed(1))
                : 5.0,
            studentsCount: course.enrollments ? course.enrollments.length : 0,
            videos: (course.videos || []).map(v => ({
                id: v.id,
                title: v.title,
                url: v.url,
                description: v.description || '',
                duration: '12:00'
            })),
            reviews: (course.reviews || []).map(r => ({
                id: r.id,
                rating: r.rating,
                comment: r.comment || '',
                userName: r.user?.name || 'Anonymous',
                createdAt: new Date().toISOString()
            })),
            thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
            certificateProvided: true
        }));

        return { courses: formattedCourses };
    } catch (error) {
        console.error("Database error in getAllCourses:", error);
        throw new Error(error.message || "Failed to fetch courses from PostgreSQL database");
    }
};

/**
 * Fetch details of a single course by ID from PostgreSQL.
 */
exports.getCourseById = async (courseId) => {
    if (!courseId) {
        throw new Error("Course ID is required");
    }

    try {
        const course = await prisma.course.findUnique({
            where: { id: Number(courseId) },
            include: {
                user: { select: { id: true, name: true, email: true } },
                videos: true,
                reviews: {
                    include: {
                        user: { select: { id: true, name: true } }
                    }
                },
                enrollments: true
            }
        });

        if (!course) {
            throw new Error("Course not found");
        }

        return { course };
    } catch (error) {
        console.error("Database error in getCourseById:", error);
        throw new Error(error.message || "Failed to fetch course from database");
    }
};
