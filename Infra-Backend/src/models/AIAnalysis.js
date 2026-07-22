const mongoose = require("mongoose");

const aiAnalysisSchema = new mongoose.Schema(
    {
        analysisCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            immutable: true,
        },

        inspection: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Inspection",
            required: [true, "Inspection is required."],
        },

        status: {
            type: String,
            enum: {
                values: [
                    "Queued",
                    "Processing",
                    "Completed",
                    "Failed",
                    "Cancelled",
                ],
                message: "Invalid analysis status.",
            },
            default: "Queued",
        },

        progress: {
            type: Number,
            default: 0,
            min: [0, "Progress cannot be less than 0."],
            max: [100, "Progress cannot exceed 100."],
        },

        currentStep: {
            type: String,
            trim: true,
            default: "Waiting in queue",
            maxlength: [
                150,
                "Current step cannot exceed 150 characters.",
            ],
        },

        totalImages: {
            type: Number,
            default: 0,
            min: 0,
        },

        processedImages: {
            type: Number,
            default: 0,
            min: 0,
        },

        averageConfidence: {
            type: Number,
            min: 0,
            max: 100,
        },

        overallSeverity: {
            type: String,
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

        analysisVersion: {
            type: Number,
            required: true,
        },

        riskScore: {
            type: Number,
            min: 0,
            max: 100,
        },

        startedAt: {
            type: Date,
        },

        completedAt: {
            type: Date,
        },

        errorMessage: {
            type: String,
            trim: true,
            maxlength: [
                500,
                "Error message cannot exceed 500 characters.",
            ],
        },

        createdBy: {
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
aiAnalysisSchema.index({ inspection: 1 });
aiAnalysisSchema.index({ status: 1 });
aiAnalysisSchema.index({ createdBy: 1 });
aiAnalysisSchema.index({ analysisCode: 1 });

module.exports = mongoose.model(
    "AIAnalysis",
    aiAnalysisSchema
);