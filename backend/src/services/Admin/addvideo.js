const prisma = require('../config/prisma');
exports.upload_video = async (data) => {
    const { user_id, video_url, course_id , video_title, video_description } = data;

    if(!user_id || !video_url || !course_id || !video_title || !video_description){
        throw new Error("All fields are required");
    }

    try {
        const video = await prisma.video.findFirst({
            where: {
                courseId: course_id,
                title: video_title
            }
        });

        if (video) {
            throw new Error("Video with this title already exists for this course");
        }
        const video = await prisma.video.create({
            data: {
                title: video_title,
                url: video_url,
                description: video_description,
                courseId: course_id
            }
        });;
    } catch (error) {
        throw new Error(error.message);
    }
}