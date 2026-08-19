const prisma = require('../../config/prisma');

exports.deleteVideo = async (data) => {
    const { userid, user_id, videoId, courseId, course_id } = data;
    const cleanVideoId = Number(videoId);
    const cleanCourseId = (courseId || course_id) ? Number(courseId || course_id) : null;

    if (!cleanVideoId) {
        throw new Error("Video ID is required");
    }

    try {
        const video = await prisma.video.findUnique({   
            where: { id: cleanVideoId },
        });

        if (!video) {
            throw new Error("Video not found");
        }

        if (cleanCourseId && video.courseId !== cleanCourseId) {
            throw new Error("Video does not belong to this course");
        }

        await prisma.video.delete({
            where: { id: cleanVideoId },
        });

        return { message: "Video deleted successfully", deletedVideoId: cleanVideoId };
    }
    catch (error) {
        console.error("Error in deleteVideo:", error);
        throw new Error(error.message || "Failed to delete video");
    }
};

exports.deletevideo = exports.deleteVideo;

