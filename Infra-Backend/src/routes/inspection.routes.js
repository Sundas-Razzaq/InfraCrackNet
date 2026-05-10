const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/upload.middleware');
const controller = require('../controllers/inspection.controller');

router.post('/upload', protect, upload.single('image'), controller.uploadInspection);
router.get('/history', protect, controller.getHistory);
router.get('/:id', protect, controller.getInspection);
router.get('/report/:id', protect, controller.downloadReport);

module.exports = router;
