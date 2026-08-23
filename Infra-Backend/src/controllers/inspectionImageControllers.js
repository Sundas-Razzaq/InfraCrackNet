const mongoose = require("mongoose");

const Inspection = require("../models/inspection");
const InspectionImage = require("../models/inspectionImage");

const {
    uploadImage,
    deleteImage,
} = require("../services/cloudinaryService");

/* Upload Inspection Images */
const uploadInspectionImages = async (req, res) => {
    try {
        const { inspection } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: "Please upload at least one image.",
            });
        }

        const existingInspection =
            await Inspection.findOne({ _id: inspection, createdBy: req.user.id }).select(
                "inspectionCode status"
            );

        if (!existingInspection) {
            return res.status(404).json({
                message: "Inspection not found.",
            });
        }

        const uploadedImages = await Promise.all(
            req.files.map(async (file) => {
                const uploadedImage = await uploadImage(
                    file.buffer,
                    `InfraCrackNet/Inspections/${existingInspection.inspectionCode}`
                );

                return {
                    inspection: inspection,
                    imageUrl: uploadedImage.secure_url,
                    publicId: uploadedImage.public_id,
                    originalFileName: Buffer.from(file.originalname, "latin1").toString("utf8"),
                    fileSize: file.size,
                    mimeType: file.mimetype,
                    width: uploadedImage.width,
                    height: uploadedImage.height,
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
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* Get Inspection Images */
const getInspectionImages = async (req, res) => {
    try {
        const { inspectionId } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                inspectionId
            )
        ) {
            return res.status(400).json({
                message: "Invalid inspection ID.",
            });
        }

        const inspection =
            await Inspection.findOne({ _id: inspectionId, createdBy: req.user.id }).select(
                "inspectionCode"
            );

        if (!inspection) {
            return res.status(404).json({
                message: "Inspection not found.",
            });
        }

        const images = await InspectionImage.find({
            inspection: inspectionId,
        })
            .populate(
                "uploadedBy",
                "name email role"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: images.length,
            data: images,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* Delete Inspection Image */
const deleteInspectionImage = async (
    req,
    res
) => {
    try {
        const { imageId } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(imageId)
        ) {
            return res.status(400).json({
                message: "Invalid image ID.",
            });
        }

        const image = await InspectionImage.findOne({
            _id: imageId,
            uploadedBy: req.user.id
        });

        if (!image) {
            return res.status(404).json({
                message: "Image not found.",
            });
        }

        // Verify ownership of the parent inspection
        const inspection = await Inspection.findOne({
            _id: image.inspection,
            createdBy: req.user.id,
        });

        if (!inspection) {
            return res.status(404).json({
                success: false,
                message: "Image not found.",
            });
        }

        await deleteImage(image.publicId);

        const inspectionId = image.inspection;

        await InspectionImage.findByIdAndDelete(
            imageId
        );

        const remainingImages =
            await InspectionImage.countDocuments({
                inspection: inspectionId,
            });

        if (remainingImages === 0) {
            await Inspection.findByIdAndUpdate(
                inspectionId,
                {
                    status: "Draft",
                }
            );
        }

        return res.status(200).json({
            success: true,
            message:
                "Inspection image deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

const getUploadedImageCount = async (req, res) => {
    try {
        const count = await InspectionImage.countDocuments({
            uploadedBy: req.user.id,
        });

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
    getUploadedImageCount,
};