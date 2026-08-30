const mongoose = require("mongoose");

const AIAnalysis = require("../models/AIAnalysis");
const Inspection = require("../models/inspection");
const InspectionImage = require("../models/inspectionImage");
const CrackDetection = require("../models/crackDetection");

const generateAnalysisCode = require("../utils/analysisCodeGenerator");

const {
    startMockAnalysis,
} = require("../services/analysisService");

// START AI ANALYSIS 

const startAnalysis = async (req, res, next) => {
    try {
        const { inspectionId } = req.params;

        const existingInspection =
            await Inspection.findOne({ _id: inspectionId, createdBy: req.user.id });

        if (!existingInspection) {
            return res.status(404).json({
                success: false,
                message: "Inspection not found.",
            });
        }

        // Prevent analysis on completed inspections
        if (
            ["Validated", "Report Generated"].includes(
                existingInspection.status
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "This inspection can no longer be analyzed.",
            });
        }

        const totalImages =
            await InspectionImage.countDocuments({
                inspection: inspectionId,
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
                inspection: inspectionId,
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
                inspection: inspectionId,
            })) + 1;

        const analysis =
            await AIAnalysis.create({
                analysisCode,
                inspection: inspectionId,

                analysisVersion,

                status: "Queued",
                progress: 0,
                currentStep: "Waiting in queue",
                validationStatus: "Pending",

                totalImages,
                processedImages: 0,

                createdBy: req.user.id,
            });

        existingInspection.status =
            "AI Processing";

        await existingInspection.save();

        // Run AI asynchronously
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

// GET LATEST ANALYSIS FOR AN INSPECTION

const getInspectionAnalysis = async (
    req,
    res,
    next
) => {
    try {
        const { inspectionId } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                inspectionId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid inspection ID.",
            });
        }

        const inspection =
            await Inspection.findOne({
                _id: inspectionId,
                createdBy: req.user.id,
            });

        if (!inspection) {
            return res.status(404).json({
                success: false,
                message:
                    "Inspection not found.",
            });
        }

        const analysis =
            await AIAnalysis.findOne({
                inspection: inspectionId,
            }).sort({
                createdAt: -1,
            });

        return res.status(200).json({
            success: true,
            data: analysis,
        });
    } catch (error) {
        next(error);
    }
};

// GET ALL AI ANALYSES

const getAllAnalysis = async (req, res, next) => {
    try {
        const analyses = await AIAnalysis.find({
            createdBy: req.user.id,
        })
            .select(
                "analysisCode analysisVersion status validationStatus progress currentStep totalImages processedImages averageConfidence overallSeverity riskScore startedAt completedAt createdAt validatedBy validatedAt rejectionReason inspection"
            )
            .populate({
                path: "inspection",
                select:
                    "inspectionCode inspectionType structureArea status project",
                populate: {
                    path: "project",
                    select:
                        "projectCode name structureType location priority",
                },
            })
            .populate({
                path: "validatedBy",
                select: "name",
            })
            .sort({
                createdAt: -1,
            });

        return res.status(200).json({
            success: true,
            count: analyses.length,
            data: analyses,
        });
    } catch (error) {
        next(error);
    }
};

// GET ANALYSIS PROGRESS STATUs

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
            await AIAnalysis.findOne({
                _id: analysisId,
                createdBy: req.user.id
            });

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

// GET ANALYSIS RESULTS

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
                message: "Invalid analysis ID.",
            });
        }

        const analysis = await AIAnalysis.findOne({
            _id: analysisId,
            createdBy: req.user.id,
        }).populate({
            path: "inspection",
            select:
                "inspectionCode structureArea status totalImages project",
            populate: {
                path: "project",
                select:
                    "projectCode name structureType",
            },
        });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: "Analysis not found.",
            });
        }

        if (analysis.status !== "Completed") {
            return res.status(400).json({
                success: false,
                message:
                    "Analysis has not completed yet.",
            });
        }

        const cracks = await CrackDetection.find({
            analysis: analysisId,
        })
            .populate(
                "inspectionImage",
                "imageUrl originalFileName"
            )
            .sort({ createdAt: 1 });

        // Aggregated Statistics

        const maxWidth =
            cracks.length > 0
                ? Math.max(
                    ...cracks.map(
                        (crack) => crack.width
                    )
                )
                : 0;

        const maxLength =
            cracks.length > 0
                ? Math.max(
                    ...cracks.map(
                        (crack) => crack.length
                    )
                )
                : 0;

        const totalAffectedArea =
            cracks.reduce(
                (sum, crack) =>
                    sum + (crack.area || 0),
                0
            );

        const severityBreakdown = {
            Low: 0,
            Medium: 0,
            High: 0,
            Critical: 0,
        };

        cracks.forEach((crack) => {
            severityBreakdown[
                crack.severity
            ]++;
        });

        const processingTime =
            analysis.completedAt &&
                analysis.startedAt
                ? analysis.completedAt.getTime() -
                analysis.startedAt.getTime()
                : null;

        return res.status(200).json({
            success: true,

            data: {
                analysis,

                summary: {
                    totalCracks:
                        cracks.length,

                    averageConfidence:
                        analysis.averageConfidence ??
                        0,

                    overallSeverity:
                        analysis.overallSeverity ??
                        null,

                    riskScore:
                        analysis.riskScore ??
                        0,

                    totalImages:
                        analysis.totalImages,

                    processedImages:
                        analysis.processedImages,

                    maxWidth,

                    maxLength,

                    totalAffectedArea,

                    severityBreakdown,

                    startedAt:
                        analysis.startedAt,

                    completedAt:
                        analysis.completedAt,

                    processingTime,
                },

                cracks,
            },
        });
    } catch (error) {
        next(error);
    }
};

// APPROVE AI ANALYSIS
const approveAnalysis = async (req, res, next) => {
    try {
        const { analysisId } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(analysisId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid analysis ID.",
            });
        }

        const analysis = await AIAnalysis.findOne({
            _id: analysisId,
            createdBy: req.user.id,
        });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: "Analysis not found.",
            });
        }

        // Analysis must be completed before approval
        if (analysis.status !== "Completed") {
            return res.status(400).json({
                success: false,
                message:
                    "Only completed analyses can be approved.",
            });
        }

        // Prevent approving an already decided analysis
        if (
            ["Approved", "Rejected"].includes(
                analysis.validationStatus
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `Analysis has already been ${analysis.validationStatus.toLowerCase()}.`,
            });
        }

        analysis.validationStatus = "Approved";
        analysis.validatedBy = req.user.id;
        analysis.validatedAt = new Date();
        analysis.rejectionReason = "";

        await analysis.save();

        // Move inspection to validated state
        await Inspection.findByIdAndUpdate(
            analysis.inspection,
            {
                status: "Validated",
            }
        );

        return res.status(200).json({
            success: true,
            message:
                "AI analysis approved successfully.",
            data: analysis,
        });
    } catch (error) {
        next(error);
    }
};


// REJECT AI ANALYSIS
const rejectAnalysis = async (req, res, next) => {
    try {
        const { analysisId } = req.params;
        const { rejectionReason } = req.body;

        if (
            !mongoose.Types.ObjectId.isValid(analysisId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid analysis ID.",
            });
        }

        const analysis = await AIAnalysis.findOne({
            _id: analysisId,
            createdBy: req.user.id,
        });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: "Analysis not found.",
            });
        }

        if (analysis.status !== "Completed") {
            return res.status(400).json({
                success: false,
                message:
                    "Only completed analyses can be rejected.",
            });
        }

        if (
            ["Approved", "Rejected"].includes(
                analysis.validationStatus
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `Analysis has already been ${analysis.validationStatus.toLowerCase()}.`,
            });
        }

        analysis.validationStatus = "Rejected";
        analysis.validatedBy = req.user.id;
        analysis.validatedAt = new Date();
        analysis.rejectionReason =
            rejectionReason.trim();

        await analysis.save();

        // Rejected analysis can be analyzed again
        await Inspection.findByIdAndUpdate(
            analysis.inspection,
            {
                status: "Images Uploaded",
            }
        );

        return res.status(200).json({
            success: true,
            message:
                "AI analysis rejected successfully.",
            data: analysis,
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
            await AIAnalysis.findOne({
                _id: analysisId,
                createdBy: req.user.id
            });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message:
                    "Analysis not found.",
            });
        }

        if (
            [
                "Completed",
                "Cancelled",
                "Failed",
            ].includes(
                analysis.status
            )
        ) {
            return res.status(400).json({
                success: false,
                message: `Analysis is already ${analysis.status.toLowerCase()}.`,
            });
        }

        analysis.status =
            "Cancelled";

        analysis.currentStep =
            "Analysis cancelled";

        analysis.completedAt =
            new Date();

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
    getInspectionAnalysis,
    getAllAnalysis,
    getAnalysisProgress,
    getAnalysisResults,
    approveAnalysis,
    rejectAnalysis,
    cancelAnalysis,
};