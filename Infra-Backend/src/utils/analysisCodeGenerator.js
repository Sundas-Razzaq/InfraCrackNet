const AIAnalysis = require("../models/AIAnalysis");

const generateAnalysisCode = async () => {
    const latestAnalysis = await AIAnalysis.findOne()
        .sort({ createdAt: -1 })
        .select("analysisCode");

    if (!latestAnalysis) {
        return "ANA-001";
    }

    const latestNumber = parseInt(
        latestAnalysis.analysisCode.split("-")[1],
        10
    );

    const nextNumber = latestNumber + 1;

    return `ANA-${String(nextNumber).padStart(3, "0")}`;
};

module.exports = generateAnalysisCode;
