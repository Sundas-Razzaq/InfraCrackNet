const { pickSeverity, recommendationFor } = require('../utils/severityGenerator');

const CRACK_TYPES = [
    'Longitudinal Crack',
    'Transverse Crack',
    'Surface Crack'
];

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function generateMockDetection() {
    const crackCount = randInt(1, 5);
    const crackSeverity = pickSeverity();
    const confidenceScore = Number((70 + Math.random() * 30).toFixed(1));
    const crackType = CRACK_TYPES[Math.floor(Math.random() * CRACK_TYPES.length)];
    const recommendation = recommendationFor(crackSeverity);

    return {
        crackCount,
        crackSeverity,
        confidenceScore,
        crackType,
        recommendation
    };
}

module.exports = { generateMockDetection };
