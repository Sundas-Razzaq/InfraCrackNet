const mongoose = require("mongoose");

const AIAnalysis = require("../models/AIAnalysis");
const Inspection = require("../models/inspection");
const InspectionImage = require("../models/inspectionImage");
const CrackDetection = require("../models/crackDetection");

const generateAnalysisCode = require("../utils/analysisCodeGenerator");

const {
    startMockAnalysis,
} = require("../services/analysisService");

//  START ANALYSIS 

const startAnalysis = async (req, res, next) => {
    try {
        const { inspection } = req.body;

        const existingInspection =
            await Inspection.findById(inspection);

        if (!existingInspection) {
            return res.status(404).json({
                success: false,
                message: "Inspection not found.",
            });
        }

        const totalImages =
            await InspectionImage.countDocuments({
                inspection,
            });

        if (totalImages === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Please upload inspection images before starting AI analysis.",
            });
        }

        const runningAnalysis =
            await AIAnalysis.findOne({
                inspection,
                status: {
                    $in: [
                        "Queued",
                        "Processing",
                    ],
                },
            });

        if (runningAnalysis) {
            return res.status(409).json({
                success: false,
                message:
                    "An AI analysis is already running for this inspection.",
            });
        }

        const analysisCode =
            await generateAnalysisCode();

        const analysisVersion =
            (await AIAnalysis.countDocuments({
                inspection,
            })) + 1;

        const analysis =
            await AIAnalysis.create({
                analysisCode,
                inspection,

                analysisVersion,

                status: "Queued",
                progress: 0,
                currentStep: "Waiting in queue",

                totalImages,
                processedImages: 0,

                createdBy: req.user.id,
            });

        existingInspection.status =
            "AI Processing";

        await existingInspection.save();

        // Run mock AI in background
        setImmediate(() => {
            startMockAnalysis(analysis._id);
        });
        return res.status(201).json({
            success: true,
            message:
                "AI analysis started successfully.",
            data: analysis,
        });
    } catch (error) {
        next(error);
    }
};

//  GET PROGRESS 

const getAnalysisProgress = async (
    req,
    res,
    next
) => {
    try {
        const { analysisId } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                analysisId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid analysis ID.",
            });
        }

        const analysis =
            await AIAnalysis.findById(
                analysisId
            );

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message:
                    "Analysis not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                status: analysis.status,
                progress:
                    analysis.progress,
                currentStep:
                    analysis.currentStep,
                processedImages:
                    analysis.processedImages,
                totalImages:
                    analysis.totalImages,
            },
        });
    } catch (error) {
        next(error);
    }
};

// GET RESULTS 

const getAnalysisResults = async (
    req,
    res,
    next
) => {
    try {
        const { analysisId } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                analysisId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid analysis ID.",
            });
        }

        const analysis =
            await AIAnalysis.findById(
                analysisId
            );

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message:
                    "Analysis not found.",
            });
        }

        const cracks =
            await CrackDetection.find({
                analysis: analysisId,
            }).sort({
                createdAt: 1,
            });

        return res.status(200).json({
            success: true,
            data: {
                analysis,

                summary: {
                    totalCracks:
                        cracks.length,
                    averageConfidence:
                        analysis.averageConfidence ||
                        0,
                    overallSeverity:
                        analysis.overallSeverity ||
                        null,
                    riskScore:
                        analysis.riskScore ||
                        0,
                },

                cracks,
            },
        });
    } catch (error) {
        next(error);
    }
};

// CANCEL ANALYSIS 

const cancelAnalysis = async (
    req,
    res,
    next
) => {
    try {
        const { analysisId } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                analysisId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid analysis ID.",
            });
        }

        const analysis =
            await AIAnalysis.findById(
                analysisId
            );

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message:
                    "Analysis not found.",
            });
        }

        if (
            analysis.status ===
            "Completed"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Completed analysis cannot be cancelled.",
            });
        }

        analysis.status =
            "Cancelled";

        analysis.currentStep =
            "Analysis cancelled";

        await analysis.save();

        await Inspection.findByIdAndUpdate(
            analysis.inspection,
            {
                status:
                    "Images Uploaded",
            }
        );

        return res.status(200).json({
            success: true,
            message:
                "Analysis cancelled successfully.",
            data: analysis,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    startAnalysis,
    getAnalysisProgress,
    getAnalysisResults,
    cancelAnalysis,
};