const mongoose = require("mongoose");

const AIAnalysis = require("../models/AIAnalysis");
const CrackDetection = require("../models/crackDetection");
const InspectionImage = require("../models/inspectionImage");
const Inspection = require("../models/inspection");
// GET ANNOTATION WORKSPACE

const getAnnotationWorkspace = async (
    req,
    res,
    next
) => {
    try {
        const { analysisId } = req.params;

        const analysis =
            await AIAnalysis.findOne({ _id: analysisId, createdBy: req.user.id })
                .populate({
                    path: "inspection",
                    select:
                        "inspectionCode structureArea status project",
                    populate: {
                        path: "project",
                        select:
                            "projectCode name structureType location priority",
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
                    "Annotation is only available after AI analysis is completed.",
            });
        }

        const images =
            await InspectionImage.find({
                inspection:
                    analysis.inspection._id,
            })
                .select(
                    "imageUrl originalFileName uploadedAt"
                )
                .sort({
                    createdAt: 1,
                });

        const cracks =
            await CrackDetection.find({
                analysis: analysisId,
            })
                .populate(
                    "inspectionImage",
                    "imageUrl originalFileName"
                )
                .sort({
                    createdAt: 1,
                });

        return res.status(200).json({
            success: true,
            data: {
                analysis,

                images,

                cracks,

                summary: {
                    totalImages: images.length,

                    totalCracks: cracks.filter(
                        crack =>
                            crack.validationStatus !== "Removed"
                    ).length,

                    reviewedCracks: cracks.filter(
                        crack =>
                            crack.validationStatus !== "Removed" &&
                            crack.reviewStatus === "Completed"
                    ).length,

                    pendingReview: cracks.filter(
                        crack =>
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


// UPDATE AI CRACK

const updateCrack = async (req, res, next) => {
    try {
        const { crackId } = req.params;

        const crack = await CrackDetection.findById(crackId);
        if (crack.validationStatus === "Removed") {
            return res.status(400).json({
                success: false,
                message: "Removed cracks cannot be edited.",
            });
        }

        if (!crack) {
            return res.status(404).json({
                success: false,
                message: "Crack not found.",
            });
        }

        const analysis = await AIAnalysis.findOne({
            _id: crack.analysis,
            createdBy: req.user.id,
        });

        if (!analysis) {
            return res.status(403).json({
                success: false,
                message: "Access denied.",
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

        // Update editable fields only if provided
        if (crackClass !== undefined)
            crack.crackClass = crackClass;

        if (severity !== undefined)
            crack.severity = severity;

        if (reviewedSeverity !== undefined)
            crack.reviewedSeverity = reviewedSeverity;

        if (width !== undefined)
            crack.width = width;

        if (length !== undefined)
            crack.length = length;

        if (area !== undefined)
            crack.area = area;

        if (boundingBox !== undefined)
            crack.boundingBox = boundingBox;

        if (reviewComments !== undefined)
            crack.reviewComments = reviewComments;

        // Review metadata
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

// REMOVE AI CRACK 

const removeCrack = async (
    req,
    res,
    next
) => {
    try {
        const { crackId } = req.params;

        const crack = await CrackDetection.findById(
            crackId
        );
        if (crack.validationStatus === "Removed") {
            return res.status(400).json({
                success: false,
                message: "Crack is already removed.",
            });
        }
        if (!crack) {
            return res.status(404).json({
                success: false,
                message: "Crack not found.",
            });
        }

        const analysis = await AIAnalysis.findOne({
            _id: crack.analysis,
            createdBy: req.user.id,
        });

        if (!analysis) {
            return res.status(403).json({
                success: false,
                message: "Access denied."
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
            message:
                "Crack removed successfully.",
            data: crack,
        });
    } catch (error) {
        next(error);
    }
};


// ADD MANUAL CRACK 

const addManualCrack = async (
    req,
    res,
    next
) => {
    try {
        const {
            analysis,
            inspectionImage,
            crackClass,
            severity,
            width,
            length,
            area,
            boundingBox,
            reviewComments,
        } = req.body;

        // Verify analysis exists
        const existingAnalysis =
            await AIAnalysis.findOne({ _id: analysis, createdBy: req.user.id });

        if (!existingAnalysis) {
            return res.status(404).json({
                success: false,
                message: "Analysis not found.",
            });
        }

        // Verify inspection image exists
        const image =
            await InspectionImage.findOne({
                _id: inspectionImage,
                uploadedBy: req.user.id
            });

        if (!image) {
            return res.status(404).json({
                success: false,
                message:
                    "Inspection image not found.",
            });
        }

        // Generate next Crack ID
        const crackCount =
            await CrackDetection.countDocuments({
                analysis,
            });

        const crackId = `CRK-${String(
            crackCount + 1
        ).padStart(3, "0")}`;

        const crack =
            await CrackDetection.create({
                analysis,
                inspectionImage,

                crackId,

                crackClass,
                confidence: 100,

                severity,

                reviewedSeverity:
                    severity,

                width,
                length,
                area,

                boundingBox,

                source: "Manual",

                validationStatus:
                    "Added",

                reviewStatus:
                    "Completed",

                reviewVersion: 1,

                reviewedBy: req.user.id,
                reviewedAt: new Date(),

                reviewComments,

                isValidated: true,

                aiNotes:
                    "Added manually by engineer.",
            });

        return res.status(201).json({
            success: true,
            message:
                "Manual crack added successfully.",
            data: crack,
        });
    } catch (error) {
        next(error);
    }
};

// VALIDATE AI CRACK 
const validateCrack = async (
    req,
    res,
    next
) => {
    try {
        const { crackId } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                crackId
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid crack ID.",
            });
        }

        const crack =
            await CrackDetection.findById(
                crackId
            );

        if (crack.validationStatus === "Removed") {
            return res.status(400).json({
                success: false,
                message: "Removed cracks cannot be validated.",
            });
        }

        if (!crack) {
            return res.status(404).json({
                success: false,
                message: "Crack not found.",
            });
        }

        const analysis = await AIAnalysis.findOne({
            _id: crack.analysis,
            createdBy: req.user.id,
        });

        if (!analysis) {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        crack.validationStatus =
            "Validated";

        crack.reviewStatus =
            "Completed";

        crack.reviewedBy =
            req.user.id;

        crack.reviewedAt =
            new Date();

        crack.isValidated =
            true;

        crack.reviewVersion += 1;

        await crack.save();

        return res.status(200).json({
            success: true,
            message:
                "Crack validated successfully.",
            data: crack,
        });
    } catch (error) {
        next(error);
    }
};

//complete Annotation Review
const completeAnnotationReview = async (
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

        const analysis =
            await AIAnalysis.findOne({ _id: analysisId, createdBy: req.user.id });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: "Analysis not found.",
            });
        }

        const cracks =
            await CrackDetection.find({
                analysis: analysisId,
            });

        if (cracks.length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "No crack detections found for this analysis.",
            });
        }

        const pendingReviews =
            cracks.filter(
                (crack) =>
                    crack.reviewStatus !==
                    "Completed"
            );

        if (pendingReviews.length > 0) {
            return res.status(400).json({
                success: false,
                message:
                    "All cracks must be reviewed before completing annotation.",
            });
        }

        await Inspection.findByIdAndUpdate(
            analysis.inspection,
            {
                status: "Validated",
            }
        );

        return res.status(200).json({
            success: true,
            message:
                "Annotation review completed successfully.",
            data: {
                analysisId,
                reviewedCracks:
                    cracks.length,
                inspectionStatus:
                    "Validated",
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