const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const UPLOADS_ROOT = path.join(__dirname, '../../uploads');
const PROCESSED_DIR = path.join(UPLOADS_ROOT, 'processed');
fs.mkdirSync(PROCESSED_DIR, { recursive: true });

function colorForSeverity(severity) {
    switch (severity) {
        case 'Minor':
            return 'rgba(0,200,0,0.9)';
        case 'Moderate':
            return 'rgba(255,200,0,0.9)';
        case 'Severe':
            return 'rgba(255,0,0,0.9)';
        default:
            return 'rgba(255,0,0,0.9)';
    }
}

function randomLinesSVG(width, height, count, color) {
    const strokeWidth = Math.max(2, Math.floor(Math.min(width, height) / 150));
    let lines = '';
    for (let i = 0; i < count; i++) {
        const x1 = Math.floor(Math.random() * width * 0.9);
        const y1 = Math.floor(Math.random() * height * 0.9);
        const x2 = Math.floor(x1 + (Math.random() * width * 0.2 - width * 0.1));
        const y2 = Math.floor(y1 + (Math.random() * height * 0.2 - height * 0.1));
        const opacity = 0.6 + Math.random() * 0.4;
        lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-opacity="${opacity}" />`;
    }
    return `<?xml version="1.0"?>
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <g>${lines}</g>
  </svg>`;
}

async function generateOverlay(originalPath, severity, fileNameHint) {
    const img = sharp(originalPath);
    const meta = await img.metadata();
    const width = meta.width || 800;
    const height = meta.height || 600;
    const linesCount = Math.floor(Math.random() * 4) + 2; // 2-5
    const color = colorForSeverity(severity);

    const svg = randomLinesSVG(width, height, linesCount, color);

    const outName = `${Date.now()}-${fileNameHint || 'proc'}.png`;
    const outPath = path.join(PROCESSED_DIR, outName);

    await img
        .composite([{ input: Buffer.from(svg), blend: 'over' }])
        .png()
        .toFile(outPath);

    return outPath;
}

module.exports = { generateOverlay };
