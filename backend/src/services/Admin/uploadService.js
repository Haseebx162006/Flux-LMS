const cloudinary = require('../../config/cloudinary');

exports.uploadImage = async (imageData) => {
    if (!imageData) {
        throw new Error("Image data is required");
    }

    // If Cloudinary credentials are not configured, gracefully return the image URI or placeholder
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.warn("Cloudinary credentials not set in .env. Returning image URI.");
        return { url: imageData };
    }

    try {
        const uploadResult = await cloudinary.uploader.upload(imageData, {
            folder: 'flux_lms_courses',
            resource_type: 'image'
        });

        return {
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id
        };
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw new Error(error.message || "Failed to upload image to Cloudinary");
    }
};
