const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype.startsWith("image/") ||
        file.mimetype.startsWith("video/")
    ) {
        return cb(null, true);
    }

    cb(
        new Error(
            "Only image or video files are allowed."
        ),
        false
    );
};

const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
    fileFilter,
});

module.exports = upload;