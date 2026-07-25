const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        reportCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            immutable: true,
        },

        inspection: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Inspection",
            required: true,
        },

        analysis: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AIAnalysis",
            required: true,
        },

        generatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        version: {
            type: Number,
            default: 1,
        },

        status: {
            type: String,
            enum: [
                "Draft",
                "Final",
            ],
            default: "Final",
        },

        reportUrl: {
            type: String,
            default: "",
        },

        fileName: {
            type: String,
            default: "",
        },

        recommendations: [
            {
                type: String,
                trim: true,
            },
        ],

        generatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
reportSchema.index({ inspection: 1 });
reportSchema.index({ analysis: 1 });
reportSchema.index({ generatedBy: 1 });
reportSchema.index({ reportCode: 1 });
reportSchema.index({ generatedAt: -1 });

module.exports = mongoose.model(
    "Report",
    reportSchema
);