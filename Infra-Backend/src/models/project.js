const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema(
    {
        projectCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            immutable: true,
        },

        name: {
            type: String,
            required: [true, "Project name is required."],
            trim: true,
            maxlength: [100, "Project name cannot exceed 100 characters."],
        },

        description: {
            type: String,
            required: [true, "Project description is required."],
            trim: true,
            maxlength: [1000, "Description cannot exceed 1000 characters."],
        },

        structureType: {
            type: String,
            required: [true, "Structure type is required."],
            enum: {
                values: ["Bridge", "Building", "Road"],
                message: "Invalid structure type.",
            },
        },

        location: {
            type: String,
            required: [true, "Project location is required."],
            trim: true,
            maxlength: [200, "Location cannot exceed 200 characters."],
        },

        priority: {
            type: String,
            required: [true, "Project priority is required."],
            enum: {
                values: ["Low", "Medium", "High", "Critical"],
                message: "Invalid project priority.",
            },
            default: "Medium",
        },

        status: {
            type: String,
            enum: {
                values: ["Active", "On Hold", "Completed"],
                message: "Invalid project status.",
            },
            default: "Active",
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
projectSchema.index({ name: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ structureType: 1 });
projectSchema.index({ location: 1 });
projectSchema.index({ createdBy: 1 });
projectSchema.index({ assignedInspectors: 1 });

module.exports = mongoose.model("Project", projectSchema);