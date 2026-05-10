const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const UPLOADS_ROOT = path.join(__dirname, '../../uploads');
const REPORTS_DIR = path.join(UPLOADS_ROOT, 'reports');
fs.mkdirSync(REPORTS_DIR, { recursive: true });

function createReportPdf({ inspectionId, originalImagePath, processedImagePath, crackSeverity, crackCount, confidenceScore, recommendation }) {
    return new Promise((resolve, reject) => {
        try {
            const fileName = `inspection-${inspectionId}-${Date.now()}.pdf`;
            const outPath = path.join(REPORTS_DIR, fileName);
            const doc = new PDFDocument({ autoFirstPage: false });
            const stream = fs.createWriteStream(outPath);
            doc.pipe(stream);

            doc.addPage({ size: 'A4', margin: 50 });
            doc.fontSize(20).text('InfraCrackNet - Inspection Report', { align: 'center' });
            doc.moveDown();

            doc.fontSize(12).text(`Inspection ID: ${inspectionId}`);
            doc.text(`Date: ${new Date().toLocaleString()}`);
            doc.moveDown();

            doc.fontSize(14).text('Summary', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(12).text(`Crack Severity: ${crackSeverity}`);
            doc.text(`Crack Count: ${crackCount}`);
            doc.text(`Confidence Score: ${confidenceScore}%`);
            doc.moveDown();
            doc.fontSize(12).text('Recommendation:');
            doc.fontSize(11).text(recommendation);

            if (originalImagePath && fs.existsSync(originalImagePath)) {
                doc.addPage({ size: 'A4', margin: 40 });
                doc.fontSize(14).text('Original Image', { align: 'left' });
                doc.moveDown(0.5);
                try {
                    doc.image(originalImagePath, { fit: [500, 400], align: 'center' });
                } catch (err) { }
            }

            if (processedImagePath && fs.existsSync(processedImagePath)) {
                doc.addPage({ size: 'A4', margin: 40 });
                doc.fontSize(14).text('Processed Overlay', { align: 'left' });
                doc.moveDown(0.5);
                try {
                    doc.image(processedImagePath, { fit: [500, 400], align: 'center' });
                } catch (err) { }
            }

            doc.end();

            stream.on('finish', () => resolve(outPath));
            stream.on('error', (err) => reject(err));
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = { createReportPdf };
