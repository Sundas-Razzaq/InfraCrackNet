const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const UPLOADS_ROOT = path.join(__dirname, '../../uploads');
const ORIGINAL_DIR = path.join(UPLOADS_ROOT, 'original');

fs.mkdirSync(ORIGINAL_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, ORIGINAL_DIR);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        const name = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
        cb(null, name);
    }
});

function fileFilter(req, file, cb) {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type. Only JPEG, PNG and WEBP are allowed.'));
}

const upload = multer({
    storage,
    limits: { fileSize: 6 * 1024 * 1024 }, // 6 MB
    fileFilter
});

module.exports = { upload };
