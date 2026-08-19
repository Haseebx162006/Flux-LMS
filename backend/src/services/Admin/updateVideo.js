const prisma = require('../../config/prisma');

exports.updateVideo = async (data) => {
    const { videoId, video_title, video_description ,courseId  } = data;
    if (!courseId || !videoId || !video_title || !video_description) {
        throw new Error("All fields are required");
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
        await prisma.video.update({
            where: { id: videoId },
            data: {
                title: video_title,
                description: video_description
            }
        });
        return { message: "Video updated successfully" };
    }
    catch (error) {
        throw new Error(error.message);
    }
}
