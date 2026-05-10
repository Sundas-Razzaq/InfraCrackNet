const path = require('path');
const fs = require('fs');
const Inspection = require('../models/inspection.model');
const { generateMockDetection } = require('../services/mockDetection.service');
const { generateOverlay } = require('../services/overlay.service');
const { createReportPdf } = require('../services/pdf.service');

async function uploadInspection(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image file is required', data: {} });
        }

        const userId = req.user && req.user.id ? req.user.id : req.user._id;
        const originalPath = req.file.path;

        const mock = await generateMockDetection();

        const processedPath = await generateOverlay(originalPath, mock.crackSeverity, req.file.filename.replace(/\.[^.]+$/, ''));

        // create a placeholder inspection doc first to get an id for the report filename
        const inspection = new Inspection({
            user: userId,
            originalImage: path.relative(path.join(__dirname, '../../'), originalPath).replace(/\\/g, '/'),
            processedImage: path.relative(path.join(__dirname, '../../'), processedPath).replace(/\\/g, '/'),
            crackCount: mock.crackCount,
            crackSeverity: mock.crackSeverity,
            confidenceScore: mock.confidenceScore,
            crackType: mock.crackType,
            recommendation: mock.recommendation
        });

        await inspection.save();

        const reportPath = await createReportPdf({
            inspectionId: inspection._id.toString(),
            originalImagePath: originalPath,
            processedImagePath: processedPath,
            crackSeverity: mock.crackSeverity,
            crackCount: mock.crackCount,
            confidenceScore: mock.confidenceScore,
            recommendation: mock.recommendation
        });

        inspection.reportPath = path.relative(path.join(__dirname, '../../'), reportPath).replace(/\\/g, '/');
        await inspection.save();

        return res.status(201).json({ success: true, message: 'Inspection created', data: inspection });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error', data: { error: err.message } });
    }
}

async function getHistory(req, res) {
    try {
        const userId = req.user && req.user.id ? req.user.id : req.user._id;
        const items = await Inspection.find({ user: userId }).sort({ createdAt: -1 });
        return res.json({ success: true, message: 'History fetched', data: items });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error', data: { error: err.message } });
    }
}

async function getInspection(req, res) {
    try {
        const id = req.params.id;
        const item = await Inspection.findById(id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found', data: {} });

        const userId = req.user && req.user.id ? req.user.id : req.user._id;
        if (item.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Forbidden', data: {} });
        }

        return res.json({ success: true, message: 'Inspection fetched', data: item });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error', data: { error: err.message } });
    }
}

async function downloadReport(req, res) {
    try {
        const id = req.params.id;
        const item = await Inspection.findById(id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found', data: {} });

        const userId = req.user && req.user.id ? req.user.id : req.user._id;
        if (item.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Forbidden', data: {} });
        }

        if (!item.reportPath) return res.status(404).json({ success: false, message: 'Report not available', data: {} });

        const absPath = path.join(path.join(__dirname, '../../'), item.reportPath);
        if (!fs.existsSync(absPath)) return res.status(404).json({ success: false, message: 'Report file missing', data: {} });

        return res.download(absPath);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error', data: { error: err.message } });
    }
}

module.exports = { uploadInspection, getHistory, getInspection, downloadReport };
