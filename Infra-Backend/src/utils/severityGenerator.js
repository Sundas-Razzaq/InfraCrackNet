function pickSeverity() {
    const r = Math.random();
    if (r < 0.5) return 'Minor';
    if (r < 0.85) return 'Moderate';
    return 'Severe';
}

function recommendationFor(severity) {
    switch (severity) {
        case 'Minor':
            return 'Monitor the crack and schedule routine inspections.';
        case 'Moderate':
            return 'Recommend local repair and close monitoring.';
        case 'Severe':
            return 'Immediate structural assessment and urgent remediation required.';
        default:
            return '';
    }
}

module.exports = { pickSeverity, recommendationFor };
