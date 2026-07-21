const mongoose = require("mongoose");

const inspectionSchema = new mongoose.Schema(
    {
        inspectionCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            immutable: true,
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: [true, "Project is required."],
        },

        inspectionType: {
            type: String,
            required: [true, "Inspection type is required."],
            enum: {
                values: [
                    "Routine",
                    "Emergency",
                    "Maintenance",
                    "Follow-up",
                ],
                message: "Invalid inspection type.",
            },
        },

        structureArea: {
            type: String,
            required: [true, "Structure area is required."],
            trim: true,
            maxlength: [
                150,
                "Structure area cannot exceed 150 characters.",
            ],
        },

        gpsLocation: {
            type: String,
            required: [true, "GPS location is required."],
            trim: true,
            maxlength: [
                200,
                "GPS location cannot exceed 200 characters.",
            ],
        },

        weather: {
            type: String,
            required: [true, "Weather condition is required."],
            trim: true,
            maxlength: [
                100,
                "Weather cannot exceed 100 characters.",
            ],
        },

        priority: {
            type: String,
            required: [true, "Inspection priority is required."],
            enum: {
                values: [
                    "Low",
                    "Medium",
                    "High",
                    "Critical",
                ],
                message: "Invalid inspection priority.",
            },
            default: "Medium",
        },

        scheduledDate: {
            type: Date,
        },

        inspectionDate: {
            type: Date,
        },

        fieldNotes: {
            type: String,
            trim: true,
            maxlength: [
                2000,
                "Field notes cannot exceed 2000 characters.",
            ],
        },

        status: {
            type: String,
            enum: {
                values: [
                    "Draft",
                    "Images Uploaded",
                    "AI Processing",
                    "AI Completed",
                    "Validated",
                    "Report Generated",
                    "Completed",
                ],
                message: "Invalid inspection status.",
            },
            default: "Draft",
        },

        assignedEngineers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        assignedInspectors: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

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
inspectionSchema.index({ inspectionCode: 1 });
inspectionSchema.index({ project: 1 });
inspectionSchema.index({ status: 1 });
inspectionSchema.index({ priority: 1 });
inspectionSchema.index({ inspectionType: 1 });
inspectionSchema.index({ createdBy: 1 });
inspectionSchema.index({ assignedEngineers: 1 });
inspectionSchema.index({ assignedInspectors: 1 });

module.exports = mongoose.model(
    "Inspection",
    inspectionSchema
);