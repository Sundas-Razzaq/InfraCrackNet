const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// CHANGED: accept resourceType ("image" | "video") — default "image"
const uploadImage = (buffer, folder, resourceType = "image") => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: resourceType,
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
};

const deleteImage = async (publicId, resourceType = "image") => {
    if (!publicId) {
        return;
    }

    await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
    });
};

module.exports = {
    uploadImage,
    deleteImage,
};