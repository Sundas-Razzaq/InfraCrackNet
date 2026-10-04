const mongoose = require("mongoose");

const AIAnalysis = require("../models/AIAnalysis");
const CrackDetection = require("../models/crackDetection");
const InspectionImage = require("../models/inspectionImage");
const Inspection = require("../models/inspection");

const { hasProjectAccess } = require("../utils/projectAccess");
const {
    createNotification,
} = require("../services/notificationService");

/* Helper: load analysis + verify project access */
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

/* Helper: load crack + its analysis + verify access */
const loadCrackWithAccess = async (crackId, user) => {
    if (!mongoose.Types.ObjectId.isValid(crackId)) {
        return { error: "invalid-id" };
    }

    const crack = await CrackDetection.findById(crackId);

    if (!crack) {
        return { error: "not-found" };
    }

    const analysis = await AIAnalysis.findById(
        crack.analysis
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

    return { crack, analysis };
};

/* GET ANNOTATION WORKSPACE */
const getAnnotationWorkspace = async (req, res, next) => {
    try {
        const { analysisId } = req.params;

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
                message: "Access denied.",
            });
        }

        if (analysis.status !== "Completed") {
            return res.status(400).json({
                success: false,
                message:
                    "Annotation is only available after AI analysis is completed.",
            });
        }

        const images = await InspectionImage.find({
            inspection: analysis.inspection._id,
        })
            .select("imageUrl originalFileName uploadedAt")
            .sort({ createdAt: 1 });

        const cracks = await CrackDetection.find({
            analysis: analysisId,
        })
            .populate(
                "inspectionImage",
                "imageUrl originalFileName"
            )
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            data: {
                analysis,
                images,
                cracks,
                summary: {
                    totalImages: images.length,
                    totalCracks: cracks.filter(
                        (crack) =>
                            crack.validationStatus !== "Removed"
                    ).length,
                    reviewedCracks: cracks.filter(
                        (crack) =>
                            crack.validationStatus !== "Removed" &&
                            crack.reviewStatus === "Completed"
                    ).length,
                    pendingReview: cracks.filter(
                        (crack) =>
                            crack.validationStatus !== "Removed" &&
                            crack.reviewStatus !== "Completed"
                    ).length,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/* UPDATE AI CRACK */
const updateCrack = async (req, res, next) => {
    try {
        const { crackId } = req.params;

        const { crack, error } = await loadCrackWithAccess(
            crackId,
            req.user
        );

        if (error === "invalid-id") {
            return res.status(400).json({
                success: false,
                message: "Invalid crack ID.",
            });
        }

        if (error === "not-found") {
            return res.status(404).json({
                success: false,
                message: "Crack not found.",
            });
        }

        if (error === "forbidden") {
            return res.status(403).json({
                success: false,
                message: "Access denied.",
            });
        }

        if (crack.validationStatus === "Removed") {
            return res.status(400).json({
                success: false,
                message: "Removed cracks cannot be edited.",
            });
        }

        const {
            crackClass,
            severity,
            reviewedSeverity,
            width,
            length,
            area,
            boundingBox,
            reviewComments,
        } = req.body;

        if (crackClass !== undefined)
            crack.crackClass = crackClass;
        if (severity !== undefined)
            crack.severity = severity;
        if (reviewedSeverity !== undefined)
            crack.reviewedSeverity = reviewedSeverity;
        if (width !== undefined) crack.width = width;
        if (length !== undefined) crack.length = length;
        if (area !== undefined) crack.area = area;
        if (boundingBox !== undefined)
            crack.boundingBox = boundingBox;
        if (reviewComments !== undefined)
            crack.reviewComments = reviewComments;

        crack.reviewStatus = "Completed";
        crack.validationStatus = "Edited";
        crack.reviewedBy = req.user.id;
        crack.reviewedAt = new Date();
        crack.reviewVersion += 1;

        await crack.save();

        return res.status(200).json({
            success: true,
            message: "Crack updated successfully.",
            data: crack,
        });
    } catch (error) {
        next(error);
    }
};

/* REMOVE AI CRACK */
const removeCrack = async (req, res, next) => {
    try {
        const { crackId } = req.params;

        const { crack, error } = await loadCrackWithAccess(
            crackId,
            req.user
        );

        if (error === "invalid-id") {
            return res.status(400).json({
                success: false,
                message: "Invalid crack ID.",
            });
        }

        if (error === "not-found") {
            return res.status(404).json({
                success: false,
                message: "Crack not found.",
            });
        }

        if (error === "forbidden") {
            return res.status(403).json({
                success: false,
                message: "Access denied.",
            });
        }

        if (crack.validationStatus === "Removed") {
            return res.status(400).json({
                success: false,
                message: "Crack is already removed.",
            });
        }

        crack.validationStatus = "Removed";
        crack.reviewStatus = "Completed";
        crack.reviewedBy = req.user.id;
        crack.reviewedAt = new Date();
        crack.reviewVersion += 1;
        crack.isValidated = true;

        await crack.save();

        return res.status(200).json({
            success: true,
            message: "Crack removed successfully.",
            data: crack,
        });
    } catch (error) {
        next(error);
    }
};

/* ADD MANUAL CRACK */
const addManualCrack = async (req, res, next) => {
    try {
        const {
            analysis: analysisId,
            inspectionImage,
            crackClass,
            severity,
            width,
            length,
            area,
            boundingBox,
            reviewComments,
        } = req.body;

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
                message: "Access denied.",
            });
        }

        // verify the image belongs to the SAME inspection
        const image = await InspectionImage.findOne({
            _id: inspectionImage,
            inspection: analysis.inspection._id,
        });

        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Inspection image not found.",
            });
        }

        const crackCount =
            await CrackDetection.countDocuments({
                analysis: analysisId,
            });

        const crackId = `CRK-${String(
            crackCount + 1
        ).padStart(3, "0")}`;

        const crack = await CrackDetection.create({
            analysis: analysisId,
            inspectionImage,
            crackId,
            crackClass,
            confidence: 100,
            severity,
            reviewedSeverity: severity,
            width,
            length,
            area,
            boundingBox,
            source: "Manual",
            validationStatus: "Added",
            reviewStatus: "Completed",
            reviewVersion: 1,
            reviewedBy: req.user.id,
            reviewedAt: new Date(),
            reviewComments,
            isValidated: true,
            aiNotes: "Added manually by engineer.",
        });

        return res.status(201).json({
            success: true,
            message: "Manual crack added successfully.",
            data: crack,
        });
    } catch (error) {
        next(error);
    }
};

/* VALIDATE AI CRACK */
const validateCrack = async (req, res, next) => {
    try {
        const { crackId } = req.params;

        const { crack, error } = await loadCrackWithAccess(
            crackId,
            req.user
        );

        if (error === "invalid-id") {
            return res.status(400).json({
                success: false,
                message: "Invalid crack ID.",
            });
        }

        if (error === "not-found") {
            return res.status(404).json({
                success: false,
                message: "Crack not found.",
            });
        }

        if (error === "forbidden") {
            return res.status(403).json({
                success: false,
                message: "Access denied.",
            });
        }

        if (crack.validationStatus === "Removed") {
            return res.status(400).json({
                success: false,
                message:
                    "Removed cracks cannot be validated.",
            });
        }

        crack.validationStatus = "Validated";
        crack.reviewStatus = "Completed";
        crack.reviewedBy = req.user.id;
        crack.reviewedAt = new Date();
        crack.isValidated = true;
        crack.reviewVersion += 1;

        await crack.save();

        return res.status(200).json({
            success: true,
            message: "Crack validated successfully.",
            data: crack,
        });
    } catch (error) {
        next(error);
    }
};

/* COMPLETE ANNOTATION REVIEW */
const completeAnnotationReview = async (
    req,
    res,
    next
) => {
    try {
        const { analysisId } = req.params;

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
                message: "Access denied.",
            });
        }

        const cracks = await CrackDetection.find({
            analysis: analysisId,
        });

        if (cracks.length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "No crack detections found for this analysis.",
            });
        }

        const pendingReviews = cracks.filter(
            (crack) => crack.reviewStatus !== "Completed"
        );

        if (pendingReviews.length > 0) {
            return res.status(400).json({
                success: false,
                message:
                    "All cracks must be reviewed before completing annotation.",
            });
        }

        // capture updated inspection so we can notify.
        const inspection =
            await Inspection.findByIdAndUpdate(
                analysis.inspection._id,
                { status: "Validated" },
                { new: true }
            );

        //  notify the Inspector that results are validated.
        if (inspection) {
            await createNotification({
                recipient: inspection.createdBy,
                type: "report",
                title: "Annotation review complete — ready for report",
                message: `Annotation review for inspection ${inspection.inspectionCode} is complete. You can now generate the report.`,
                relatedEntity: "Inspection",
                relatedEntityId: inspection._id,
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Annotation review completed successfully.",
            data: {
                analysisId,
                reviewedCracks: cracks.length,
                inspectionStatus: "Validated",
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAnnotationWorkspace,
    updateCrack,
    removeCrack,
    addManualCrack,
    validateCrack,
    completeAnnotationReview,
};