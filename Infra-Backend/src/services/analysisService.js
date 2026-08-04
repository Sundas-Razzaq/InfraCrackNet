const AIAnalysis = require("../models/AIAnalysis");
const CrackDetection = require("../models/crackDetection");
const Inspection = require("../models/inspection");
const InspectionImage = require("../models/inspectionImage");

const crackClasses = [
    "Longitudinal",
    "Transverse",
    "Diagonal",
    "Alligator",
    "Surface",
];

const severityLevels = [
    "Low",
    "Medium",
    "High",
    "Critical",
];

const delay = (ms) =>
    new Promise((resolve) =>
        setTimeout(resolve, ms)
    );

const startMockAnalysis = async (analysisId) => {
    try {
        const analysis =
            await AIAnalysis.findById(analysisId);

        if (!analysis) return;

        /* -----------------------------
           STEP 1 : Preparing Images
        ------------------------------*/

        analysis.status = "Processing";
        analysis.startedAt = new Date();
        analysis.currentStep =
            "Preparing images";
        analysis.progress = 5;

        await analysis.save();

        await delay(1000);

        const images =
            await InspectionImage.find({
                inspection: analysis.inspection,
            });

        const totalImages = images.length;

        let crackCounter = 1;
        let totalConfidence = 0;
        let totalCracks = 0;
        let highestSeverityIndex = 0;

        /* -----------------------------
           STEP 2 : Crack Detection
        ------------------------------*/

        analysis.currentStep =
            "Running crack detection";

        await analysis.save();

        for (
            let imageIndex = 0;
            imageIndex < totalImages;
            imageIndex++
        ) {
            const image = images[imageIndex];

            await delay(750);

            analysis.processedImages =
                imageIndex + 1;

            // 10% -> 70%
            analysis.progress =
                10 +
                Math.round(
                    ((imageIndex + 1) /
                        totalImages) *
                    60
                );

            await analysis.save();

            const cracksInImage =
                Math.floor(
                    Math.random() * 3
                ) + 1;

            for (
                let i = 0;
                i < cracksInImage;
                i++
            ) {
                const confidence =
                    Math.floor(
                        Math.random() * 10
                    ) + 90;

                const severityIndex =
                    Math.floor(
                        Math.random() *
                        severityLevels.length
                    );

                const severity =
                    severityLevels[
                    severityIndex
                    ];

                totalConfidence +=
                    confidence;

                totalCracks++;

                if (
                    severityIndex >
                    highestSeverityIndex
                ) {
                    highestSeverityIndex =
                        severityIndex;
                }

                await CrackDetection.create({
                    analysis: analysis._id,

                    inspectionImage:
                        image._id,

                    crackId: `CRK-${String(
                        crackCounter++
                    ).padStart(3, "0")}`,

                    crackClass:
                        crackClasses[
                        Math.floor(
                            Math.random() *
                            crackClasses.length
                        )
                        ],

                    confidence,

                    severity,

                    width: Number(
                        (
                            Math.random() * 5
                        ).toFixed(2)
                    ),

                    length: Number(
                        (
                            Math.random() * 50
                        ).toFixed(2)
                    ),

                    area: Number(
                        (
                            Math.random() * 100
                        ).toFixed(2)
                    ),

                    boundingBox: {
                        x: Math.floor(
                            Math.random() * 500
                        ),

                        y: Math.floor(
                            Math.random() * 500
                        ),

                        width:
                            Math.floor(
                                Math.random() *
                                200
                            ) + 50,

                        height:
                            Math.floor(
                                Math.random() *
                                120
                            ) + 30,
                    },

                    aiNotes:
                        "Mock AI generated detection.",

                    isValidated: false,
                });
            }
        }

        /* -----------------------------
           STEP 3 : Severity Classification
        ------------------------------*/

        analysis.currentStep =
            "Severity classification";
        analysis.progress = 80;

        await analysis.save();

        await delay(1000);

        analysis.averageConfidence =
            totalCracks > 0
                ? Number(
                    (
                        totalConfidence /
                        totalCracks
                    ).toFixed(2)
                )
                : 0;

        analysis.overallSeverity =
            severityLevels[
            highestSeverityIndex
            ];

        /* -----------------------------
           STEP 4 : Risk Assessment
        ------------------------------*/

        analysis.currentStep =
            "Structural risk assessment";
        analysis.progress = 90;

        await analysis.save();

        await delay(1000);

        const riskScores = {
            Low: 25,
            Medium: 50,
            High: 75,
            Critical: 95,
        };

        analysis.riskScore =
            riskScores[
            analysis.overallSeverity
            ];

        /* -----------------------------
           STEP 5 : Compiling Analysis
        ------------------------------*/

        analysis.currentStep =
            "Compiling analysis";
        analysis.progress = 98;

        await analysis.save();

        await delay(1000);

        /* -----------------------------
           COMPLETED
        ------------------------------*/

        analysis.status = "Completed";
        analysis.currentStep =
            "Analysis completed";
        analysis.progress = 100;
        analysis.completedAt = new Date();

        await analysis.save();

        await Inspection.findByIdAndUpdate(
            analysis.inspection,
            {
                status: "AI Completed",
            }
        );
    } catch (error) {
        console.error(
            "Mock AI Error:",
            error.message
        );

        await AIAnalysis.findByIdAndUpdate(
            analysisId,
            {
                status: "Failed",
                currentStep:
                    "Analysis failed",
                errorMessage:
                    error.message,
            }
        );

        const analysis =
            await AIAnalysis.findById(
                analysisId
            );

        if (analysis) {
            await Inspection.findByIdAndUpdate(
                analysis.inspection,
                {
                    status:
                        "Images Uploaded",
                }
            );
        }
    }
};

module.exports = {
    startMockAnalysis,
};