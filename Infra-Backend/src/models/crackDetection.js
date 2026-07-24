const mongoose = require("mongoose");

const crackDetectionSchema = new mongoose.Schema(
    {
        analysis: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AIAnalysis",
            required: [true, "AI Analysis is required."],
        },

        inspectionImage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InspectionImage",
            required: [true, "Inspection image is required."],
        },

        crackId: {
            type: String,
            required: true,
            trim: true,
        },

        crackClass: {
            type: String,
            required: true,
            enum: {
                values: [
                    "Longitudinal",
                    "Transverse",
                    "Diagonal",
                    "Alligator",
                    "Pothole",
                    "Surface",
                    "Other",
                ],
                message: "Invalid crack class.",
            },
        },

        confidence: {
            type: Number,
            required: true,
            min: [0, "Confidence cannot be less than 0."],
            max: [100, "Confidence cannot exceed 100."],
        },

        severity: {
            type: String,
            required: true,
            enum: {
                values: [
                    "Low",
                    "Medium",
                    "High",
                    "Critical",
                ],
                message: "Invalid severity level.",
            },
        },

        width: {
            type: Number,
            required: true,
            min: 0,
        },

        length: {
            type: Number,
            required: true,
            min: 0,
        },

        area: {
            type: Number,
            default: 0,
            min: 0,
        },

        boundingBox: {
            x: {
                type: Number,
                required: true,
            },
            y: {
                type: Number,
                required: true,
            },
            width: {
                type: Number,
                required: true,
            },
            height: {
                type: Number,
                required: true,
            },
        },

        segmentationMask: {
            type: String,
            default: "",
        },

        validationStatus: {
            type: String,
            enum: [
                "Pending",
                "Validated",
                "Edited",
                "Removed",
                "Added",
            ],
            default: "Pending",
        },

        reviewStatus: {
            type: String,
            enum: [
                "Pending",
                "In Review",
                "Completed",
            ],
            default: "Pending",
        },

        reviewVersion: {
            type: Number,
            default: 1,
        },

        aiNotes: {
            type: String,
            trim: true,
            maxlength: [
                1000,
                "",
            ],
            default: "",
        },

        isValidated: {
            type: Boolean,
            default: false,
        },

        reviewedSeverity: {
            type: String,
            enum: {
                values: [
                    "Low",
                    "Medium",
                    "High",
                    "Critical",
                ],
                message: "Invalid review severity.",
            },
            default: null,
        },

        source: {
            type: String,
            enum: ["AI", "Manual"],
            default: "AI",
        },

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        reviewedAt: {
            type: Date,
            default: null,
        },

        reviewComments: {
            type: String,
            trim: true,
            maxlength: [
                1000,
                "Review comments cannot exceed 1000 characters.",
            ],
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
crackDetectionSchema.index({ analysis: 1 });
crackDetectionSchema.index({ inspectionImage: 1 });
crackDetectionSchema.index({ severity: 1 });
crackDetectionSchema.index({ crackClass: 1 });
crackDetectionSchema.index({ confidence: -1 });
crackDetectionSchema.index({ isValidated: 1 });
crackDetectionSchema.index({ validationStatus: 1 });
crackDetectionSchema.index({ reviewStatus: 1 });
crackDetectionSchema.index({ reviewedSeverity: 1 });
crackDetectionSchema.index({ reviewVersion: 1 });
crackDetectionSchema.index({ source: 1 });

module.exports = mongoose.model(
    "CrackDetection",
    crackDetectionSchema
);