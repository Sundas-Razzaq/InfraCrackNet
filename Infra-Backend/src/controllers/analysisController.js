const mongoose = require("mongoose");

const AIAnalysis = require("../models/AIAnalysis");
const Inspection = require("../models/inspection");
const InspectionImage = require("../models/inspectionImage");
const CrackDetection = require("../models/crackDetection");

const generateAnalysisCode = require("../utils/analysisCodeGenerator");

const {
    startMockAnalysis,
} = require("../services/analysisService");

// CHANGED: import hasProjectAccess and createNotification
const { hasProjectAccess } = require("../utils/projectAccess");
const {
    createNotification,
} = require("../services/notificationService");

/* ----------------------------------------
   Helper: load analysis + verify project access
---------------------------------------- */
// CHANGED: new helper to replace the repeated
// `AIAnalysis.findOne({ _id, createdBy: req.user.id })` pattern.
const loadAnalysisWithAccess = async (
    analysisId,
    user
) => {
    if (!mongoose.Types.ObjectId.isValid(analysisId)) {
        return { error: "invalid-id" };
    }

    const analysis = await AIAnalysis.findById(
        analysisId
    ).populate({
        path: "inspection",
        populate: { path: "project" },
    });

    if (!analysis) {
        return { error: "not-found" };
    }

    const project = analysis.inspection?.project;

    if (!hasProjectAccess(project, user)) {
        return { error: "forbidden" };
    }

    return { analysis };
};

/* ----------------------------------------
   Helper: load inspection + verify project access
---------------------------------------- */
// CHANGED: same as above but starting from an inspection.
const loadInspectionWithAccess = async (
    inspectionId,
    user
) => {
    if (!mongoose.Types.ObjectId.isValid(inspectionId)) {
        return { error: "invalid-id" };
    }

    const inspection = await Inspection.findById(
        inspectionId
    ).populate("project");

    if (!inspection) {
        return { error: "not-found" };
    }

    if (!hasProjectAccess(inspection.project, user)) {
        return { error: "forbidden" };
    }

    return { inspection };
};

/* START AI ANALYSIS (Engineer only, route-enforced) */
const startAnalysis = async (req, res, next) => {
    try {
        const { inspectionId } = req.params;

        // CHANGED: use hasProjectAccess instead of project.createdBy
        // comparison. Same effect, consistent with other modules.
        const { inspection: existingInspection, error } =
            await loadInspectionWithAccess(
                inspectionId,
                req.user
            );

        if (error === "invalid-id") {
            return res.status(400).json({
                success: false,
                message: "Invalid inspection ID.",
            });
        }

        if (error === "not-found") {
            return res.status(404).json({
                success: false,
                message: "Inspection not found.",
            });
        }

        if (error === "forbidden") {
            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to run analysis for this inspection.",
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
                    $in: ["Queued", "Processing"],
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

        const analysis = await AIAnalysis.create({
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

        existingInspection.status = "AI Processing";
        await existingInspection.save();

        // Run AI asynchronously
        setImmediate(() => {
            startMockAnalysis(analysis._id);
        });

        return res.status(201).json({
            success: true,
            message: "AI analysis started successfully.",
            data: analysis,
        });
    } catch (error) {
        next(error);
    }
};

/* GET LATEST ANALYSIS FOR AN INSPECTION */
const getInspectionAnalysis = async (req, res, next) => {
    try {
        const { inspectionId } = req.params;

        // CHANGED: use hasProjectAccess so both roles can read.
        const { inspection, error } =
            await loadInspectionWithAccess(
                inspectionId,
                req.user
            );

        if (error === "invalid-id") {
            return res.status(400).json({
                success: false,
                message: "Invalid inspection ID.",
            });
        }

        if (error === "not-found") {
            return res.status(404).json({
                success: false,
                message: "Inspection not found.",
            });
        }

        if (error === "forbidden") {
            return res.status(403).json({
                success: false,
                message:
                    "You do not have access to this inspection.",
            });
        }

        const analysis = await AIAnalysis.findOne({
            inspection: inspection._id,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: analysis,
        });
    } catch (error) {
        next(error);
    }
};

/* GET ALL AI ANALYSES */
const getAllAnalysis = async (req, res, next) => {
    try {
        // CHANGED: role-aware. Inspector sees analyses for inspections
        // they created; Engineer sees analyses for inspections in
        // projects they own; Admin sees all.
        let inspectionQuery = {};

        if (req.user.role === "Inspector") {
            inspectionQuery.createdBy = req.user.id;
        } else if (req.user.role === "Engineer") {
            const Project = require("../models/project");
            const projectIds = await Project.find({
                createdBy: req.user.id,
            }).select("_id");

            inspectionQuery.project = {
                $in: projectIds.map((p) => p._id),
            };
        }

        const inspections = await Inspection.find(
            inspectionQuery
        ).select("_id");

        const inspectionIds = inspections.map((i) => i._id);

        const analyses = await AIAnalysis.find({
            inspection: { $in: inspectionIds },
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
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: analyses.length,
            data: analyses,
        });
    } catch (error) {
        next(error);
    }
};

/* GET ANALYSIS PROGRESS */
const getAnalysisProgress = async (req, res, next) => {
    try {
        const { analysisId } = req.params;

        // CHANGED: hasProjectAccess
        const { analysis, error } =
            await loadAnalysisWithAccess(
                analysisId,
                req.user
            );

        if (error === "invalid-id") {
            return res.status(400).json({
                success: false,
                message: "Invalid analysis ID.",
            });
        }

        if (error === "not-found") {
            return res.status(404).json({
                success: false,
                message: "Analysis not found.",
            });
        }

        if (error === "forbidden") {
            return res.status(403).json({
                success: false,
                message:
                    "You do not have access to this analysis.",
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                status: analysis.status,
                progress: analysis.progress,
                currentStep: analysis.currentStep,
                processedImages: analysis.processedImages,
                totalImages: analysis.totalImages,
            },
        });
    } catch (error) {
        next(error);
    }
};

/* GET ANALYSIS RESULTS */
const getAnalysisResults = async (req, res, next) => {
    try {
        const { analysisId } = req.params;

        // CHANGED: hasProjectAccess so Inspector can view.
        const { analysis, error } =
            await loadAnalysisWithAccess(
                analysisId,
                req.user
            );

        if (error === "invalid-id") {
            return res.status(400).json({
                success: false,
                message: "Invalid analysis ID.",
            });
        }

        if (error === "not-found") {
            return res.status(404).json({
                success: false,
                message: "Analysis not found.",
            });
        }

        if (error === "forbidden") {
            return res.status(403).json({
                success: false,
                message:
                    "You do not have access to this analysis.",
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
                    ...cracks.map((c) => c.width)
                )
                : 0;

        const maxLength =
            cracks.length > 0
                ? Math.max(
                    ...cracks.map((c) => c.length)
                )
                : 0;

        const totalAffectedArea = cracks.reduce(
            (sum, c) => sum + (c.area || 0),
            0
        );

        const severityBreakdown = {
            Low: 0,
            Medium: 0,
            High: 0,
            Critical: 0,
        };

        cracks.forEach((crack) => {
            severityBreakdown[crack.severity]++;
        });

        const processingTime =
            analysis.completedAt && analysis.startedAt
                ? analysis.completedAt.getTime() -
                analysis.startedAt.getTime()
                : null;

        return res.status(200).json({
            success: true,
            data: {
                analysis,
                summary: {
                    totalCracks: cracks.length,
                    averageConfidence:
                        analysis.averageConfidence ?? 0,
                    overallSeverity:
                        analysis.overallSeverity ?? null,
                    riskScore: analysis.riskScore ?? 0,
                    totalImages: analysis.totalImages,
                    processedImages: analysis.processedImages,
                    maxWidth,
                    maxLength,
                    totalAffectedArea,
                    severityBreakdown,
                    startedAt: analysis.startedAt,
                    completedAt: analysis.completedAt,
                    processingTime,
                },
                cracks,
            },
        });
    } catch (error) {
        next(error);
    }
};

/* APPROVE AI ANALYSIS (Engineer only) */
const approveAnalysis = async (req, res, next) => {
    try {
        const { analysisId } = req.params;

        // CHANGED: hasProjectAccess
        const { analysis, error } =
            await loadAnalysisWithAccess(
                analysisId,
                req.user
            );

        if (error === "invalid-id") {
            return res.status(400).json({
                success: false,
                message: "Invalid analysis ID.",
            });
        }

        if (error === "not-found") {
            return res.status(404).json({
                success: false,
                message: "Analysis not found.",
            });
        }

        if (error === "forbidden") {
            return res.status(403).json({
                success: false,
                message:
                    "You do not have access to this analysis.",
            });
        }

        if (analysis.status !== "Completed") {
            return res.status(400).json({
                success: false,
                message:
                    "Only completed analyses can be approved.",
            });
        }

        if (
            ["Approved", "Rejected"].includes(
                analysis.validationStatus
            )
        ) {
            return res.status(400).json({
                success: false,
                message: `Analysis has already been ${analysis.validationStatus.toLowerCase()}.`,
            });
        }

        analysis.validationStatus = "Approved";
        analysis.validatedBy = req.user.id;
        analysis.validatedAt = new Date();
        analysis.rejectionReason = "";

        await analysis.save();

        // CHANGED: capture the updated inspection so we can notify.
        const inspection =
            await Inspection.findByIdAndUpdate(
                analysis.inspection,
                { status: "Validated" },
                { new: true }
            );

        // CHANGED: notify the Inspector (inspection.createdBy).
        if (inspection) {
            await createNotification({
                recipient: inspection.createdBy,
                type: "report",
                title: "Analysis approved — ready for report",
                message: `Analysis for inspection ${inspection.inspectionCode} was approved. You can now generate the report.`,
                relatedEntity: "Inspection",
                relatedEntityId: inspection._id,
            });
        }

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

/* REJECT AI ANALYSIS (Engineer only) — R2: back to Pending Analysis */
const rejectAnalysis = async (req, res, next) => {
    try {
        const { analysisId } = req.params;
        const { rejectionReason } = req.body;

        // CHANGED: hasProjectAccess
        const { analysis, error } =
            await loadAnalysisWithAccess(
                analysisId,
                req.user
            );

        if (error === "invalid-id") {
            return res.status(400).json({
                success: false,
                message: "Invalid analysis ID.",
            });
        }

        if (error === "not-found") {
            return res.status(404).json({
                success: false,
                message: "Analysis not found.",
            });
        }

        if (error === "forbidden") {
            return res.status(403).json({
                success: false,
                message:
                    "You do not have access to this analysis.",
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
                message: `Analysis has already been ${analysis.validationStatus.toLowerCase()}.`,
            });
        }

        analysis.validationStatus = "Rejected";
        analysis.validatedBy = req.user.id;
        analysis.validatedAt = new Date();
        analysis.rejectionReason = rejectionReason.trim();

        await analysis.save();

        // CHANGED: R2 — rejected goes back to "Pending Analysis",
        // back in the Engineer's queue for a re-run.
        const inspection =
            await Inspection.findByIdAndUpdate(
                analysis.inspection,
                { status: "Pending Analysis" },
                { new: true }
            );

        // CHANGED: notify the Inspector.
        if (inspection) {
            await createNotification({
                recipient: inspection.createdBy,
                type: "warning",
                title: "Analysis rejected",
                message: `Analysis for inspection ${inspection.inspectionCode} was rejected. Reason: ${analysis.rejectionReason}`,
                relatedEntity: "Inspection",
                relatedEntityId: inspection._id,
            });
        }

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

/* CANCEL ANALYSIS (Engineer only) — R2 */
const cancelAnalysis = async (req, res, next) => {
    try {
        const { analysisId } = req.params;

        // CHANGED: hasProjectAccess
        const { analysis, error } =
            await loadAnalysisWithAccess(
                analysisId,
                req.user
            );

        if (error === "invalid-id") {
            return res.status(400).json({
                success: false,
                message: "Invalid analysis ID.",
            });
        }

        if (error === "not-found") {
            return res.status(404).json({
                success: false,
                message: "Analysis not found.",
            });
        }

        if (error === "forbidden") {
            return res.status(403).json({
                success: false,
                message:
                    "You do not have access to this analysis.",
            });
        }

        if (
            ["Completed", "Cancelled", "Failed"].includes(
                analysis.status
            )
        ) {
            return res.status(400).json({
                success: false,
                message: `Analysis is already ${analysis.status.toLowerCase()}.`,
            });
        }

        analysis.status = "Cancelled";
        analysis.currentStep = "Analysis cancelled";
        analysis.completedAt = new Date();

        await analysis.save();

        // CHANGED: R2 — cancel puts inspection back to Pending Analysis.
        const inspection =
            await Inspection.findByIdAndUpdate(
                analysis.inspection,
                { status: "Pending Analysis" },
                { new: true }
            );

        if (inspection) {
            await createNotification({
                recipient: inspection.createdBy,
                type: "warning",
                title: "Analysis cancelled",
                message: `Analysis for inspection ${inspection.inspectionCode} was cancelled by the engineer.`,
                relatedEntity: "Inspection",
                relatedEntityId: inspection._id,
            });
        }

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