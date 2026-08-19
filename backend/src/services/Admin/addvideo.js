const prisma = require('../../config/prisma');

exports.upload_video = async (data) => {
    const { user_id, video_url, course_id, video_title, video_description } = data;

    if (!user_id || !video_url || !course_id || !video_title) {
        throw new Error("User ID, Course ID, Video Title, and Video URL are required");
    }

    const cleanTitle = String(video_title).trim();
    const cleanUrl = String(video_url).trim();
    const cleanDescription = video_description ? String(video_description).trim() : `Lesson: ${cleanTitle}`;
    const targetCourseId = Number(course_id);

    try {
        const course = await prisma.course.findUnique({
            where: { id: targetCourseId }
        });

        if (!course) {
            throw new Error(`Course with ID ${targetCourseId} not found`);
        }

        const existingVideo = await prisma.video.findFirst({
            where: {
                courseId: targetCourseId,
                title: cleanTitle
            }
        });

        if (existingVideo) {
            // Update existing video URL & description
            const updated = await prisma.video.update({
                where: { id: existingVideo.id },
                data: {
                    url: cleanUrl,
                    description: cleanDescription
                }
            });
            return { message: "Video lesson updated successfully", video: updated };
        }

        const createdVideo = await prisma.video.create({
            data: {
                title: cleanTitle,
                url: cleanUrl,
                description: cleanDescription,
                courseId: targetCourseId
            }
        });
        return { message: "Video uploaded successfully", video: createdVideo };
    } catch (error) {
        console.error("Error in upload_video service:", error);
        throw new Error(error.message || "Failed to attach video to course");
    }
};