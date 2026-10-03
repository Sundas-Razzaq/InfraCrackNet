const mongoose = require("mongoose");

const Inspection = require("../models/inspection");
const InspectionImage = require("../models/inspectionImage");
const Project = require("../models/project");

const {
    uploadImage,
    deleteImage,
} = require("../services/cloudinaryService");

const {
    createNotification,
} = require("../services/notificationService");

const { hasProjectAccess } = require("../utils/projectAccess");

/* Helper: load inspection + its project, verify access */
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

/* Upload Inspection Images (Inspector only) */
const uploadInspectionImages = async (req, res) => {
    try {
        const { inspection } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Please upload at least one image or video.",
            });
        }

        const { inspection: existingInspection, error } =
            await loadInspectionWithAccess(
                inspection,
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

        const uploadableStatuses = [
            "Draft",
            "Images Uploaded",
            "Pending Analysis",
        ];

        if (
            !uploadableStatuses.includes(
                existingInspection.status
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Cannot upload images after analysis has started.",
            });
        }

        const uploadedImages = await Promise.all(
            req.files.map(async (file) => {
                const resourceType =
                    file.mimetype.startsWith("video/")
                        ? "video"
                        : "image";

                const uploaded = await uploadImage(
                    file.buffer,
                    `InfraCrackNet/Inspections/${existingInspection.inspectionCode}`,
                    resourceType
                );

                return {
                    inspection: existingInspection._id,
                    imageUrl: uploaded.secure_url,
                    publicId: uploaded.public_id,
                    originalFileName: Buffer.from(
                        file.originalname,
                        "latin1"
                    ).toString("utf8"),
                    fileSize: file.size,
                    mimeType: file.mimetype,
                    mediaType:
                        resourceType === "video"
                            ? "video"
                            : "image",
                    width: uploaded.width,
                    height: uploaded.height,
                    duration: uploaded.duration,
                    uploadedBy: req.user.id,
                };
            })
        );

        const savedImages =
            await InspectionImage.insertMany(uploadedImages);

        existingInspection.status = "Images Uploaded";
        await existingInspection.save();

        return res.status(201).json({
            success: true,
            message:
                "Inspection images uploaded successfully.",
            count: savedImages.length,
            data: savedImages,
        });
    } catch (error) {
        console.error(
            "uploadInspectionImages error:",
            error
        );
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

/* Get Inspection Images */
const getInspectionImages = async (req, res) => {
    try {
        const { inspectionId } = req.params;

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

        const images = await InspectionImage.find({
            inspection: inspection._id,
        })
            .populate("uploadedBy", "name email role")
            .sort({ createdAt: -1 });

        const totalDuration = images
            .filter((img) => img.mediaType === "video")
            .reduce(
                (sum, img) => sum + (img.duration || 0),
                0
            );

        return res.status(200).json({
            success: true,
            count: images.length,
            totalDuration,
            data: images,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

/* Request Analysis — Inspector notifies Engineer (F2) */
const requestAnalysis = async (req, res) => {
    try {
        const { inspectionId } = req.params;

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

        // Must have at least one image before requesting analysis
        const imageCount =
            await InspectionImage.countDocuments({
                inspection: inspection._id,
            });

        if (imageCount === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Upload at least one image or video before requesting analysis.",
            });
        }

        // Only allow from a state that makes sense
        const requestableStatuses = [
            "Draft",
            "Images Uploaded",
            "Pending Analysis",
        ];

        if (
            !requestableStatuses.includes(
                inspection.status
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Analysis has already been requested or started for this inspection.",
            });
        }

        // Move to Pending Analysis
        inspection.status = "Pending Analysis";
        await inspection.save();

        // Notify the project's Engineer(s).
        // We use the project creator as the recipient — matches
        // Engineer ownership model established in the Project module.
        const engineerId =
            inspection.project?.createdBy || null;

        if (engineerId) {
            await createNotification({
                recipient: engineerId,
                type: "inspection",
                title: "Analysis requested",
                message: `Inspector requested AI analysis for inspection ${inspection.inspectionCode}.`,
                relatedEntity: "Inspection",
                relatedEntityId: inspection._id,
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Analysis requested. Engineer has been notified.",
            data: {
                inspectionId: inspection._id,
                status: inspection.status,
            },
        });
    } catch (error) {
        console.error("requestAnalysis error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

/* Delete Inspection Image */
const deleteInspectionImage = async (req, res) => {
    try {
        const { imageId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(imageId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid image ID.",
            });
        }

        const image = await InspectionImage.findById(
            imageId
        );

        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Image not found.",
            });
        }

        //  access via project, not via uploadedBy/createdBy.
        const { inspection, error } =
            await loadInspectionWithAccess(
                image.inspection,
                req.user
            );

        if (error === "forbidden") {
            return res.status(403).json({
                success: false,
                message:
                    "You do not have access to this inspection.",
            });
        }

        if (error === "not-found") {
            return res.status(404).json({
                success: false,
                message: "Inspection not found.",
            });
        }

        // block deletion once analysis has started.
        const deletableStatuses = [
            "Draft",
            "Images Uploaded",
            "Pending Analysis",
        ];

        if (
            !deletableStatuses.includes(
                inspection.status
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Cannot delete images after analysis has started.",
            });
        }

        await deleteImage(
            image.publicId,
            image.mediaType === "video"
                ? "video"
                : "image"
        );

        const inspectionId = image.inspection;

        await InspectionImage.findByIdAndDelete(imageId);

        const remainingImages =
            await InspectionImage.countDocuments({
                inspection: inspectionId,
            });

        if (remainingImages === 0) {
            await Inspection.findByIdAndUpdate(
                inspectionId,
                { status: "Draft" }
            );
        }

        return res.status(200).json({
            success: true,
            message:
                "Inspection image deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

/* Get Uploaded Image Count (role-aware) */
const getUploadedImageCount = async (req, res) => {
    try {
        let count;

        if (req.user.role === "Inspector") {
            count =
                await InspectionImage.countDocuments({
                    uploadedBy: req.user.id,
                });
        } else if (req.user.role === "Engineer") {
            const projectIds = await Project.find({
                createdBy: req.user.id,
            }).select("_id");

            const inspectionIds = await Inspection.find({
                project: { $in: projectIds.map((p) => p._id) },
            }).select("_id");

            count = await InspectionImage.countDocuments({
                inspection: {
                    $in: inspectionIds.map((i) => i._id),
                },
            });
        } else {
            count = await InspectionImage.countDocuments({});
        }

        return res.status(200).json({
            success: true,
            count,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

module.exports = {
    uploadInspectionImages,
    getInspectionImages,
    deleteInspectionImage,
    requestAnalysis,
    getUploadedImageCount,
};