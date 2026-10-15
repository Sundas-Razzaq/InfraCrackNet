const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const ALLOWED_EXTENSIONS = [
    ".jpg", ".jpeg", ".png", ".heic", ".heif", ".tiff", ".tif",
    ".avif", ".webp", ".bmp", ".gif",
    ".mp4", ".mov", ".webm", ".avi", ".mkv", ".m4v",
];

const fileFilter = (req, file, cb) => {
    const mime = (file.mimetype || "").toLowerCase();
    const ext = path
        .extname(file.originalname || "")
        .toLowerCase();

    const mimeLooksGood =
        mime.startsWith("image/") ||
        mime.startsWith("video/");

    const extLooksGood = ALLOWED_EXTENSIONS.includes(ext);

    if (mimeLooksGood || extLooksGood) {
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