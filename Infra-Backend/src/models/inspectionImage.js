const mongoose = require("mongoose");

const inspectionImageSchema = new mongoose.Schema(
    {
        inspection: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Inspection",
            required: [true, "Inspection is required."],
        },

        imageUrl: {
            type: String,
            required: [true, "Image URL is required."],
            trim: true,
        },

        publicId: {
            type: String,
            required: [true, "Cloudinary Public ID is required."],
            trim: true,
        },

        originalFileName: {
            type: String,
            required: [true, "File name is required."],
            trim: true,
            maxlength: [
                255,
                "File name cannot exceed 255 characters.",
            ],
        },

        fileSize: {
            type: Number,
            required: [true, "File size is required."],
        },

        mimeType: {
            type: String,
            required: [true, "MIME type is required."],
        },

        width: {
            type: Number,
        },

        height: {
            type: Number,
        },

        uploadStatus: {
            type: String,
            enum: {
                values: [
                    "Uploaded",
                    "AI Processing",
                    "AI Completed",
                    "Validation Pending",
                    "Validated",
                ],
                message: "Invalid upload status.",
            },
            default: "Uploaded",
        },

        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
inspectionImageSchema.index({ inspection: 1 });
inspectionImageSchema.index({ uploadedBy: 1 });
inspectionImageSchema.index({ uploadStatus: 1 });

module.exports = mongoose.model(
    "InspectionImage",
    inspectionImageSchema
);