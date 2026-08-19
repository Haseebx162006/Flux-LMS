const prisma = require('../../config/prisma');
exports.deletevideo = async (data) => {
    const {userid, videoId, courseId } = data;
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
        const video = await prisma.video.findUnique({   
            where: { id: videoId },
        });
        if (!video) {
            throw new Error("Video not found");
        }
        await prisma.video.delete({
            where: { id: videoId },
        });
        return { message: "Video deleted successfully" };
    }
    catch (error) {
        throw new Error(error.message);
    }
}
